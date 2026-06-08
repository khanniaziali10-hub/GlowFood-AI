export default function PantryLoading() {
  return (
    <div
      className="min-h-screen pt-16"
      style={{
        background:
          "radial-gradient(ellipse at 0% 0%, #f4e0e0 0%, transparent 40%), radial-gradient(ellipse at 100% 100%, #eae0f4 0%, transparent 40%), linear-gradient(135deg, #fdf4f4 0%, #f7f0fd 50%, #fdf8f0 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 pt-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div
              className="h-8 w-40 rounded-xl"
              style={{ background: "rgba(200,160,230,0.15)", animation: "pulse-danger 1.5s ease-in-out infinite" }}
            />
            <div
              className="h-4 w-56 rounded-lg"
              style={{ background: "rgba(200,160,230,0.1)", animation: "pulse-danger 1.5s ease-in-out 0.2s infinite" }}
            />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-20 rounded-xl" style={{ background: "rgba(200,160,230,0.12)" }} />
            <div className="h-10 w-28 rounded-xl" style={{ background: "rgba(200,160,230,0.2)" }} />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-4 text-center"
              style={{
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(200,160,230,0.2)",
              }}
            >
              <div className="h-6 w-6 rounded-full mx-auto mb-2" style={{ background: "rgba(200,160,230,0.2)" }} />
              <div className="h-8 w-8 rounded-lg mx-auto mb-1" style={{ background: "rgba(200,160,230,0.15)" }} />
              <div className="h-3 w-16 rounded mx-auto" style={{ background: "rgba(200,160,230,0.1)" }} />
            </div>
          ))}
        </div>

        {/* Search skeleton */}
        <div className="h-11 w-full rounded-xl mb-6" style={{ background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(200,160,230,0.2)" }} />

        {/* Filter tabs skeleton */}
        <div className="flex gap-2 mb-6 overflow-hidden">
          {[80, 48, 64, 96, 112, 56, 72].map((w, i) => (
            <div
              key={i}
              className="h-8 rounded-xl flex-shrink-0"
              style={{ width: `${w}px`, background: i === 0 ? "rgba(184,168,244,0.3)" : "rgba(200,160,230,0.12)" }}
            />
          ))}
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-4"
              style={{
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(200,160,230,0.2)",
                animation: `pulse-danger 1.5s ease-in-out ${i * 0.1}s infinite`,
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: "rgba(200,160,230,0.15)" }} />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded" style={{ background: "rgba(200,160,230,0.15)" }} />
                  <div className="h-3 w-1/2 rounded" style={{ background: "rgba(200,160,230,0.1)" }} />
                </div>
                <div className="h-5 w-16 rounded-full" style={{ background: "rgba(200,160,230,0.15)" }} />
              </div>
              <div className="flex gap-2 mt-4 pt-3" style={{ borderTop: "1px solid rgba(200,160,230,0.1)" }}>
                <div className="h-7 w-16 rounded-lg" style={{ background: "rgba(200,160,230,0.1)" }} />
                <div className="h-7 w-20 rounded-lg" style={{ background: "rgba(239,68,68,0.08)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
