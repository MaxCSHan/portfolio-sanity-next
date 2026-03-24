import { useCallback, useEffect, useRef, useState } from "react";
import { Subject } from "rxjs";
import { bufferTime, debounceTime, filter, tap } from "rxjs/operators";

// ── Constants ─────────────────────────────────────────────────────────────────
const BUFFER_MS = 300;
const DEBOUNCE_MS = 1500;
const IMPOSSIBLE_THRESHOLD = 500;
/** Pending claps older than this are discarded on mount (stale session) */
const STALE_MS = 30 * 60 * 1000;

// ── localStorage helpers ──────────────────────────────────────────────────────
interface ClapLocalState {
  total: number;     // lifetime claps from this device (for UI)
  pending: number[]; // timestamps accumulated since last flush
  lastFlush: number; // unix ms of last successful API flush
}

const emptyState = (): ClapLocalState => ({ total: 0, pending: [], lastFlush: 0 });

function readState(key: string): ClapLocalState {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? emptyState();
  } catch {
    return emptyState();
  }
}

function writeState(key: string, state: ClapLocalState): void {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch { /* storage full or SSR */ }
}

// ── Flush: send accumulated pending claps to API ──────────────────────────────
async function flushClaps(
  type: string,
  slug: string,
  storageKey: string,
  count: number,
  onSuccess: (newTotal: number) => void,
): Promise<void> {
  try {
    const res = await fetch(`/api/reactions/${type}/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count }),
    });
    if (res.ok) {
      const { count: newTotal } = await res.json();
      const state = readState(storageKey);
      state.total += count;
      state.pending = [];
      state.lastFlush = Date.now();
      writeState(storageKey, state);
      onSuccess(newTotal);
    }
  } catch {
    // Keep pending in localStorage — will be retried next visit
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export interface UseClapResult {
  /** Server total + optimistic pending — ready to display */
  count: number;
  /** Claps accumulated in the current session (for floating "+N" label) */
  sessionClaps: number;
  /** True once the impossible threshold is hit */
  isCapped: boolean;
  /** True until the first server fetch resolves */
  isLoading: boolean;
  clap: () => void;
}

export function useClaps(
  type: "post" | "portfolio",
  slug: string,
): UseClapResult {
  const storageKey = `claps:${type}:${slug}`;

  const [serverCount, setServerCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [isCapped, setIsCapped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const subjectRef = useRef<Subject<void>>(new Subject<void>());
  const isFlushingRef = useRef(false);

  // ── Mount: discard stale pending, fetch server count ───────────────────────
  useEffect(() => {
    const state = readState(storageKey);

    // Discard pending from sessions older than STALE_MS
    if (state.pending.length > 0 && Date.now() - state.lastFlush > STALE_MS) {
      state.pending = [];
      writeState(storageKey, state);
    }

    // Restore any pending from a recent closed-tab session
    if (state.pending.length > 0) {
      setPendingCount(state.pending.length);
    }

    // Fetch server total
    fetch(`/api/reactions/${type}/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setServerCount(data.count);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [type, slug, storageKey]);

  // ── RxJS pipeline ──────────────────────────────────────────────────────────
  useEffect(() => {
    const subject = subjectRef.current;

    const sub = subject
      .pipe(
        // Immediately update localStorage + local UI on every click
        tap(() => {
          const state = readState(storageKey);
          state.pending.push(Date.now());
          writeState(storageKey, state);
          setPendingCount(state.pending.length);
          if (state.pending.length >= IMPOSSIBLE_THRESHOLD) setIsCapped(true);
        }),
        // Outer guard: micro-batch sub-300ms bursts into one activity signal
        bufferTime(BUFFER_MS),
        filter((buf) => buf.length > 0),
        // Session detector: fires 1500ms after the last activity window
        debounceTime(DEBOUNCE_MS),
      )
      .subscribe(() => {
        if (isFlushingRef.current) return;
        const state = readState(storageKey);
        if (state.pending.length === 0) return;

        const count = Math.min(state.pending.length, IMPOSSIBLE_THRESHOLD);
        isFlushingRef.current = true;

        flushClaps(type, slug, storageKey, count, (newTotal) => {
          setServerCount(newTotal);
          setPendingCount(0);
          setIsCapped(false);
        }).finally(() => {
          isFlushingRef.current = false;
        });
      });

    return () => sub.unsubscribe();
  }, [type, slug, storageKey]);

  const clap = useCallback(() => {
    subjectRef.current.next();
  }, []);

  return {
    count: serverCount + pendingCount,
    sessionClaps: pendingCount,
    isCapped,
    isLoading,
    clap,
  };
}
