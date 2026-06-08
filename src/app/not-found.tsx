import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, #f4e0e0 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #eae0f4 0%, transparent 50%), linear-gradient(135deg, #fdf4f4 0%, #f7f0fd 50%, #fdf8f0 100%)",
      }}
    >
      <div className="text-8xl mb-6 animate-float">🥗</div>

      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest"
        style={{
          background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(200,160,230,0.3)",
          color: "#9b72cf",
          backdropFilter: "blur(12px)",
        }}
      >
        404 · PAGE NOT FOUND
      </div>

      <h1
        className="text-4xl sm:text-5xl font-extrabold mb-3"
        style={{ color: "#3d2c3d" }}
      >
        This dish doesn&apos;t exist
      </h1>
      <p className="text-base mb-8 max-w-md" style={{ color: "#9b8aa0" }}>
        Looks like this page expired — just like last week&apos;s leftovers.
        Let&apos;s get you back to your pantry.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <Link
          href="/"
          className="glow-button text-white font-bold px-8 py-3.5 rounded-2xl flex items-center gap-2"
        >
          🏠 Go Home
        </Link>
        <Link
          href="/pantry"
          className="font-semibold px-8 py-3.5 rounded-2xl flex items-center gap-2 transition-all hover:scale-[1.02]"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(12px)",
            border: "1.5px solid rgba(200,160,230,0.4)",
            color: "#7c4e8a",
          }}
        >
          🌿 Open Pantry
        </Link>
      </div>
    </div>
  );
}
