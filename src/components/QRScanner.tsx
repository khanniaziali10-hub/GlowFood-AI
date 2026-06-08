"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X, CheckCircle, AlertCircle, Loader } from "lucide-react";

interface QRScannerProps {
  onResult: (barcode: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onResult, onClose }: QRScannerProps) {
  const [status, setStatus] = useState<"loading" | "scanning" | "success" | "error">("loading");
  const [error, setError] = useState<string>("");
  const [lastCode, setLastCode] = useState<string>("");
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  const handleClose = async () => {
    mountedRef.current = false;
    if (scannerRef.current) {
      try {
        // Stop the scanner first, then clear
        await scannerRef.current.stop();
      } catch (err) {
        // Ignore - scanner might not be running
      }
    }
    onClose();
  };

  useEffect(() => {
    mountedRef.current = true;

    const startScanner = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { Html5Qrcode } = await import("html5-qrcode");

        if (!mountedRef.current) return;
        if (!containerRef.current) return;

        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        const config = {
          fps: 15,
          qrbox: { width: 240, height: 180 },
          aspectRatio: 1.33,
          showTorchButtonIfSupported: true,
        };

        await scanner.start(
          { facingMode: "environment" },
          config,
          (decodedText: string) => {
            if (!mountedRef.current) return;
            setLastCode(decodedText);
            setStatus("success");
            // Stop after first successful scan
            scanner.stop().catch(() => {});
            setTimeout(() => onResult(decodedText), 800);
          },
          () => {
            // Scan failure callback (called on every frame) – ignore
          }
        );

        if (mountedRef.current) setStatus("scanning");
      } catch (err: unknown) {
        if (!mountedRef.current) return;
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Permission") || msg.includes("permission")) {
          setError("Camera permission denied. Please allow camera access and try again.");
        } else if (msg.includes("NotFound") || msg.includes("camera")) {
          setError("No camera found. Make sure your device has a camera.");
        } else {
          setError("Could not start camera. " + msg);
        }
        setStatus("error");
      }
    };

    startScanner();

    return () => {
      mountedRef.current = false;
      // Don't try to stop in cleanup - let handleClose do it
    };
  }, [onResult]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(61,44,61,0.5)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden animate-scaleIn"
        style={{
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 24px 60px rgba(120,80,160,0.3)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: "linear-gradient(135deg, rgba(244,184,184,0.3), rgba(184,168,244,0.3))",
            borderBottom: "1px solid rgba(200,160,230,0.2)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #f4b8b8, #b8a8f4)" }}
            >
              <Camera size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: "#3d2c3d" }}>
                Barcode Scanner
              </h3>
              <p className="text-xs" style={{ color: "#9b8aa0" }}>
                Point camera at a barcode or QR code
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:scale-110 transition-transform"
            style={{ background: "rgba(200,160,230,0.15)", color: "#9b72cf" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scanner viewport */}
        <div className="p-4">
          {status === "loading" && (
            <div
              className="flex flex-col items-center justify-center gap-3 py-12 rounded-2xl"
              style={{ background: "rgba(234,224,244,0.2)", border: "2px dashed rgba(200,160,230,0.3)" }}
            >
              <Loader size={32} className="animate-spin" style={{ color: "#9b72cf" }} />
              <p className="text-sm font-medium" style={{ color: "#7c4e8a" }}>
                Starting camera...
              </p>
            </div>
          )}

          {status === "error" && (
            <div
              className="flex flex-col items-center justify-center gap-3 py-10 px-4 rounded-2xl text-center"
              style={{ background: "rgba(239,68,68,0.06)", border: "2px dashed rgba(239,68,68,0.2)" }}
            >
              <AlertCircle size={32} style={{ color: "#dc2626" }} />
              <p className="text-sm font-medium" style={{ color: "#dc2626" }}>
                {error}
              </p>
              <button
                onClick={handleClose}
                className="glow-button text-white text-xs px-4 py-2 rounded-xl mt-1"
              >
                Close
              </button>
            </div>
          )}

          {status === "success" && (
            <div
              className="flex flex-col items-center justify-center gap-3 py-10 rounded-2xl text-center"
              style={{ background: "rgba(34,197,94,0.08)", border: "2px solid rgba(34,197,94,0.3)" }}
            >
              <CheckCircle size={36} style={{ color: "#16a34a" }} />
              <p className="text-sm font-bold" style={{ color: "#15803d" }}>
                Scanned!
              </p>
              <p
                className="text-xs px-3 py-1.5 rounded-full font-mono"
                style={{ background: "rgba(34,197,94,0.12)", color: "#15803d" }}
              >
                {lastCode}
              </p>
            </div>
          )}

          {/* The actual QR reader div — always mounted so html5-qrcode can attach */}
          <div
            id="qr-reader"
            ref={containerRef}
            style={{
              display: status === "scanning" ? "block" : "none",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          />

          {status === "scanning" && (
            <p
              className="text-center text-xs mt-3"
              style={{ color: "#9b8aa0" }}
            >
              🔍 Scanning... hold steady
            </p>
          )}
        </div>

        {/* Manual entry hint */}
        <div
          className="px-5 pb-5 text-center"
          style={{ borderTop: "1px solid rgba(200,160,230,0.15)" }}
        >
          <p className="text-xs pt-4" style={{ color: "#b0a0b5" }}>
            Can't scan? Close and add items manually using the{" "}
            <span style={{ color: "#9b72cf", fontWeight: 600 }}>+ Add Item</span> button
          </p>
        </div>
      </div>
    </div>
  );
}
