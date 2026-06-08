export default function Loading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-5"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, #f4e0e0 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #eae0f4 0%, transparent 50%), linear-gradient(135deg, #fdf4f4 0%, #f7f0fd 50%, #fdf8f0 100%)",
      }}
    >
      {/* Pulsing logo */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl animate-float"
        style={{
          background: "linear-gradient(135deg, #f4b8b8, #e8a8e8, #b8a8f4)",
          boxShadow: "0 8px 30px rgba(200,140,220,0.4)",
        }}
      >
        🌿
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: "linear-gradient(135deg, #f4b8b8, #b8a8f4)",
              animation: `float 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <p className="text-sm font-medium" style={{ color: "#9b8aa0" }}>
        Loading GlowFood AI…
      </p>
    </div>
  );
}
