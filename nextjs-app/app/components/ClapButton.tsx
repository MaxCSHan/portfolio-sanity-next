"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useClaps } from "@/app/hooks/useClaps";

interface Props {
  type: "post" | "portfolio";
  slug: string;
}

export default function ClapButton({ type, slug }: Props) {
  const { count, sessionClaps, isCapped, isLoading, clap } = useClaps(type, slug);

  // ── Animation state ────────────────────────────────────────────────────────
  const [bouncing, setBouncing] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  // Floating "+N" labels — each click spawns one
  const [floaters, setFloaters] = useState<{ id: number; value: number }[]>([]);
  const floaterIdRef = useRef(0);
  const prevCountRef = useRef(count);

  // Bounce on every clap
  const handleClap = useCallback(() => {
    clap();

    if (isCapped) {
      setShaking(false);
      requestAnimationFrame(() => setShaking(true));
      return;
    }

    setBouncing(false);
    requestAnimationFrame(() => setBouncing(true));

    // Spawn a "+1" floater
    const id = ++floaterIdRef.current;
    setFloaters((prev) => [...prev, { id, value: 1 }]);
    setTimeout(() => setFloaters((prev) => prev.filter((f) => f.id !== id)), 750);
  }, [clap, isCapped]);

  // Pulse the count whenever server confirms a flush
  useEffect(() => {
    if (count !== prevCountRef.current && !isLoading) {
      setPulsing(false);
      requestAnimationFrame(() => setPulsing(true));
    }
    prevCountRef.current = count;
  }, [count, isLoading]);

  // Shake when cap is first hit
  useEffect(() => {
    if (isCapped) {
      setShaking(false);
      requestAnimationFrame(() => setShaking(true));
    }
  }, [isCapped]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">

      {/* Button + floaters wrapper */}
      <div className="relative flex flex-col items-center">

        {/* Floating "+1" labels */}
        {floaters.map((f) => (
          <span
            key={f.id}
            className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2
                       font-mono font-bold text-sm text-[#0D0D0D]
                       animate-float-up"
          >
            +{f.value}
          </span>
        ))}

        {/* Clap button */}
        <button
          onClick={handleClap}
          aria-label={isCapped ? "Maximum claps reached" : "Clap for this"}
          title={isCapped ? "You've given it everything! 🎉" : undefined}
          onAnimationEnd={() => {
            setBouncing(false);
            setShaking(false);
            setPulsing(false);
          }}
          className={[
            // Base NB style
            "relative flex items-center justify-center",
            "w-14 h-14 text-2xl",
            "border-2 border-[#0D0D0D]",
            "bg-white",
            "transition-colors duration-100",
            // Press effect (not when capped)
            !isCapped &&
              "hover:bg-[#FFE500] hover:shadow-nb-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px]",
            "shadow-nb-shadow",
            // Capped: dim
            isCapped && "opacity-60 cursor-not-allowed",
            // Animations
            bouncing && "animate-clap-bounce",
            shaking  && "animate-clap-shake",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          👏
        </button>
      </div>

      {/* Count */}
      <div
        className={[
          "font-mono font-bold text-sm text-[#0D0D0D] tabular-nums",
          pulsing && "animate-count-pulse",
        ]
          .filter(Boolean)
          .join(" ")}
        onAnimationEnd={() => setPulsing(false)}
      >
        {isLoading ? (
          <span className="opacity-40">—</span>
        ) : (
          <span>{count.toLocaleString()}</span>
        )}
      </div>

      {/* Session in-progress indicator */}
      {sessionClaps > 0 && !isCapped && (
        <span className="font-mono text-xs text-gray-400 tracking-widest">
          +{sessionClaps} pending…
        </span>
      )}

      {/* Cap message */}
      {isCapped && (
        <span className="font-mono text-xs text-[#FF3B00] tracking-widest text-center">
          You&apos;ve given it everything! 🎉
        </span>
      )}
    </div>
  );
}
