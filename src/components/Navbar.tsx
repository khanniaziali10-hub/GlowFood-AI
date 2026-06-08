"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Leaf, ShoppingBasket, MessageCircle, Menu, X, Sparkles } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/pantry", label: "Pantry", icon: ShoppingBasket },
  { href: "/chat", label: "AI Chef", icon: MessageCircle },
  { href: "/insights", label: "AI Insights", icon: Leaf },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(244,224,224,0.6)",
        boxShadow: "0 2px 24px rgba(180,140,200,0.1)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{
                background: "linear-gradient(135deg, #f4b8b8, #e8a8e8, #b8a8f4)",
                boxShadow: "0 4px 12px rgba(200,140,220,0.35)",
              }}
            >
              🌿
            </div>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ color: "#3d2c3d" }}
            >
              Glow<span style={{ color: "#b87ace" }}>Food</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    background: active
                      ? "linear-gradient(135deg, rgba(244,184,184,0.4), rgba(184,168,244,0.4))"
                      : "transparent",
                    color: active ? "#7c4e8a" : "#6b5670",
                    boxShadow: active ? "0 2px 8px rgba(180,140,200,0.2)" : "none",
                  }}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* CTA button */}
          <div className="hidden md:block">
            <Link
              href="/pantry"
              className="glow-button text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
            >
              + Add Item
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: "#6b5670" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-4 pb-4 pt-2 space-y-1"
          style={{ borderTop: "1px solid rgba(244,224,224,0.5)" }}
        >
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active
                    ? "linear-gradient(135deg, rgba(244,184,184,0.3), rgba(184,168,244,0.3))"
                    : "transparent",
                  color: active ? "#7c4e8a" : "#6b5670",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
          <Link
            href="/pantry"
            onClick={() => setMobileOpen(false)}
            className="glow-button text-white text-sm font-semibold px-5 py-3 rounded-xl block text-center mt-2"
          >
            + Add Item
          </Link>
        </div>
      )}
    </nav>
  );
}
