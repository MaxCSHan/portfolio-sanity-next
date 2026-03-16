/**
 * Photo post layout — suppresses the global header and its spacing
 * so the image panel can fill the full viewport height.
 * Uses a server-rendered <style> tag: no JS, no flash.
 */
export default function PhotoPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        /* Hide the fixed global header */
        body > section > header { display: none !important; }
        /* Remove the 96px top-padding that was reserving space for it */
        body > section.min-h-screen { padding-top: 0 !important; }
      `}</style>
      {children}
    </>
  );
}
