export default function ChatLoading() {
  return (
    <div
      className="flex flex-col min-h-screen pt-16"
      style={{
        background:
          "radial-gradient(ellipse at 0% 0%, #f4e0e0 0%, transparent 40%), radial-gradient(ellipse at 100% 100%, #eae0f4 0%, transparent 40%), linear-gradient(135deg, #fdf4f4 0%, #f7f0fd 50%, #fdf8f0 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 px-4 sm:px-6 pb-6 pt-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl"
              style={{ background: "linear-gradient(135deg, rgba(244,184,184,0.5), rgba(184,168,244,0.5))" }}
            />
            <div className="space-y-1.5">
              <div className="h-5 w-40 rounded-lg" style={{ background: "rgba(200,160,230,0.2)" }} />
              <div className="h-3 w-52 rounded" style={{ background: "rgba(200,160,230,0.12)" }} />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-9 h-9 rounded-xl" style={{ background: "rgba(200,160,230,0.12)" }} />
            <div className="w-9 h-9 rounded-xl" style={{ background: "rgba(200,160,230,0.12)" }} />
          </div>
        </div>

        {/* Chat area skeleton */}
        <div
          className="flex-1 rounded-3xl overflow-hidden flex flex-col"
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(200,160,230,0.25)",
            minHeight: "400px",
          }}
        >
          <div className="flex-1 p-5 space-y-5">
            {/* AI message skeleton */}
            <div className="flex items-end gap-2">
              <div
                className="w-8 h-8 rounded-xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(244,184,184,0.5), rgba(184,168,244,0.5))" }}
              />
              <div
                className="rounded-3xl p-4 space-y-2"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(234,224,244,0.8)",
                  maxWidth: "75%",
                }}
              >
                <div className="h-3.5 w-64 rounded" style={{ background: "rgba(200,160,230,0.2)" }} />
                <div className="h-3.5 w-52 rounded" style={{ background: "rgba(200,160,230,0.15)" }} />
                <div className="h-3.5 w-40 rounded" style={{ background: "rgba(200,160,230,0.1)" }} />
              </div>
            </div>

            {/* User message skeleton */}
            <div className="flex justify-end">
              <div
                className="rounded-3xl p-4 space-y-2"
                style={{
                  background: "linear-gradient(135deg, rgba(232,168,244,0.4), rgba(184,168,244,0.4))",
                  maxWidth: "65%",
                }}
              >
                <div className="h-3.5 w-48 rounded" style={{ background: "rgba(255,255,255,0.4)" }} />
              </div>
            </div>

            {/* AI typing indicator */}
            <div className="flex items-end gap-2">
              <div
                className="w-8 h-8 rounded-xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(244,184,184,0.5), rgba(184,168,244,0.5))" }}
              />
              <div
                className="px-5 py-3 rounded-3xl flex items-center gap-2"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(234,224,244,0.8)",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#c8a0d8",
                      animation: `float 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Input skeleton */}
          <div className="p-4" style={{ borderTop: "1px solid rgba(200,160,230,0.2)" }}>
            <div className="flex items-end gap-3">
              <div
                className="flex-1 h-11 rounded-xl"
                style={{ background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(200,160,230,0.3)" }}
              />
              <div
                className="w-11 h-11 rounded-xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(244,184,184,0.5), rgba(184,168,244,0.5))" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
