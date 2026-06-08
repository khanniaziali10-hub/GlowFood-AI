"use client";

import Link from "next/link";
import { Sparkles, ShoppingBasket, MessageCircle, ArrowRight, Leaf, Zap, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";

const FEATURES = [
  {
    icon: "📦",
    title: "Smart Pantry",
    desc: "Log groceries in seconds with QR/barcode scanning. Track quantities, units, and categories effortlessly.",
    gradient: "linear-gradient(135deg, #fdf4f4, #fce8f3)",
    accent: "#e87cba",
  },
  {
    icon: "⏱️",
    title: "Expiry Intelligence",
    desc: "Visual glow alerts notify you 48 hours before anything expires. Never waste food again.",
    gradient: "linear-gradient(135deg, #fff8f0, #fef3e8)",
    accent: "#f59e0b",
  },
  {
    icon: "🤖",
    title: "AI Chef",
    desc: "Our AI reads your pantry and crafts personalized recipes that prioritize your soon-to-expire ingredients.",
    gradient: "linear-gradient(135deg, #f5f0fd, #ede8fd)",
    accent: "#9b72cf",
  },
];

const STATS = [
  { value: "40%", label: "Food waste reduced on average" },
  { value: "3 sec", label: "Average scan-to-log time" },
  { value: "∞", label: "AI recipe combinations" },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, #f4e0e0 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #eae0f4 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, #fbe5c8 0%, transparent 50%), linear-gradient(135deg, #fdf4f4 0%, #f7f0fd 50%, #fdf8f0 100%)",
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full animate-float" 
            style={{ background: "radial-gradient(circle, rgba(244,184,184,0.4), transparent)", animationDelay: "0s" }} />
          <div className="absolute top-40 right-20 w-40 h-40 rounded-full animate-float" 
            style={{ background: "radial-gradient(circle, rgba(184,168,244,0.4), transparent)", animationDelay: "1s" }} />
          <div className="absolute bottom-32 left-1/4 w-36 h-36 rounded-full animate-float" 
            style={{ background: "radial-gradient(circle, rgba(251,229,200,0.4), transparent)", animationDelay: "2s" }} />
          <div className="absolute top-1/3 right-1/3 w-28 h-28 rounded-full animate-float" 
            style={{ background: "radial-gradient(circle, rgba(206,147,216,0.3), transparent)", animationDelay: "1.5s" }} />
        </div>

        {/* Hero Content */}
        <div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          style={{ paddingTop: "80px" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 animate-fadeInUp"
            style={{
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(200,160,230,0.3)",
              boxShadow: "0 4px 16px rgba(180,140,200,0.15)",
            }}
          >
            <Sparkles size={14} style={{ color: "#9b72cf" }} />
            <span className="text-xs font-semibold" style={{ color: "#7c4e8a" }}>
              Smart Pantry Management
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fadeInUp"
            style={{
              color: "#3d2c3d",
              textShadow: "0 0 40px rgba(234,160,160,0.4), 0 0 80px rgba(200,160,234,0.2)",
              animationDelay: "0.1s",
            }}
          >
            Your Kitchen,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #f4b8b8, #e8a8e8, #b8a8f4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Reimagined
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto animate-fadeInUp"
            style={{ color: "#6b5670", animationDelay: "0.2s" }}
          >
            GlowFood tracks your pantry, alerts you before food expires, and suggests
            zero-waste recipes to help you reduce food waste and save money.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/pantry"
              className="glow-button text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 text-base"
            >
              <ShoppingBasket size={18} />
              Open My Pantry
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/chat"
              className="font-semibold px-8 py-4 rounded-2xl flex items-center gap-2 text-base transition-all hover:scale-[1.02]"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(12px)",
                border: "1.5px solid rgba(200,160,230,0.4)",
                color: "#7c4e8a",
                boxShadow: "0 4px 16px rgba(180,140,200,0.12)",
              }}
            >
              <MessageCircle size={18} />
              Ask the AI Chef
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-float"
          style={{ opacity: 0.5 }}
        >
          <div
            className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1"
            style={{ borderColor: "rgba(155,114,207,0.5)" }}
          >
            <div
              className="w-1.5 h-2 rounded-full"
              style={{ background: "#9b72cf", animation: "float 1.5s ease-in-out infinite" }}
            />
          </div>
          <span className="text-xs" style={{ color: "#b0a0b5" }}>scroll</span>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section
        className="py-14 px-6"
        style={{
          background: "linear-gradient(135deg, rgba(244,184,184,0.2), rgba(184,168,244,0.2))",
          borderTop: "1px solid rgba(200,160,230,0.15)",
          borderBottom: "1px solid rgba(200,160,230,0.15)",
        }}
      >
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div
                className="text-3xl sm:text-4xl font-extrabold mb-1"
                style={{
                  background: "linear-gradient(135deg, #f4b8b8, #9b72cf)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.value}
              </div>
              <div className="text-xs sm:text-sm" style={{ color: "#9b8aa0" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 px-6" style={{ background: "#fdf8fc" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl sm:text-4xl font-extrabold mb-3"
              style={{ color: "#3d2c3d" }}
            >
              Three pillars of{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #f4b8b8, #b8a8f4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                zero-waste living
              </span>
            </h2>
            <p className="text-base" style={{ color: "#9b8aa0" }}>
              Everything you need to eliminate food waste, starting today.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="rounded-3xl p-7 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
                style={{
                  background: f.gradient,
                  border: "1.5px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 8px 32px rgba(180,140,200,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <div
                  className="text-4xl mb-4 w-16 h-16 flex items-center justify-center rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    boxShadow: `0 4px 16px ${f.accent}33`,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "#3d2c3d" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6b5670" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 px-6 gradient-bg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl sm:text-4xl font-extrabold mb-3"
              style={{ color: "#3d2c3d" }}
            >
              Get started in{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #e8a8e8, #b8a8f4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                60 seconds
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", icon: <Zap size={22} />, title: "Scan or Add", desc: "Use your camera to scan a barcode or type in an item name — we auto-fill the rest." },
              { step: "02", icon: <Shield size={22} />, title: "Track Expiry", desc: "GlowFood monitors every item and glows brighter as expiry approaches." },
              { step: "03", icon: <Leaf size={22} />, title: "Cook Smarter", desc: "Ask the AI Chef what to cook tonight based on what's about to expire." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-5"
                  style={{
                    background: "linear-gradient(135deg, #f4b8b8, #e8a8e8, #b8a8f4)",
                    boxShadow: "0 8px 24px rgba(200,140,220,0.35)",
                  }}
                >
                  {s.icon}
                </div>
                <div
                  className="text-xs font-bold mb-1 tracking-widest"
                  style={{ color: "#c8a0d8" }}
                >
                  STEP {s.step}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#3d2c3d" }}>
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9b8aa0" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/pantry"
              className="glow-button inline-flex text-white font-bold px-10 py-4 rounded-2xl items-center gap-2 text-base"
            >
              <ShoppingBasket size={18} />
              Start For Free
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="py-10 px-6 text-center"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(200,160,230,0.2)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
              style={{ background: "linear-gradient(135deg, #f4b8b8, #e8a8e8, #b8a8f4)" }}
            >
              🌿
            </div>
            <span className="font-bold text-base" style={{ color: "#3d2c3d" }}>
              Glow<span style={{ color: "#b87ace" }}>Food</span>{" "}
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: "linear-gradient(135deg, #f4b8b8, #b8a8f4)", color: "white", fontSize: "0.65rem" }}
              >
                AI
              </span>
            </span>
          </div>
          <p className="text-sm mb-2" style={{ color: "#9b8aa0" }}>
            Smart food management for sustainable living
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-2"
            style={{
              background: "linear-gradient(135deg, rgba(244,184,184,0.2), rgba(184,168,244,0.2))",
              border: "1px solid rgba(200,160,230,0.25)",
            }}
          >
            <span className="text-xs font-semibold" style={{ color: "#7c4e8a" }}>
              👨‍💻 M Ali Asad Khan
            </span>
            <span className="text-xs" style={{ color: "#c8a0d8" }}>·</span>
            <span className="text-xs font-mono font-bold" style={{ color: "#9b72cf" }}>
              Abdullah
            </span>
          </div>
          <p className="text-xs mt-4" style={{ color: "#c8b8d0" }}>
            © 2026 GlowFood · Built with Next.js, React & Groq AI
          </p>
        </div>
      </footer>
    </>
  );
}
