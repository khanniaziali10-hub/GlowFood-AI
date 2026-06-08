import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { PantryItem } from "@/types";

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function daysUntilExpiry(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateStr);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000);
}

function buildInventoryContext(items: PantryItem[]): string {
  if (!items || items.length === 0) return "The user's pantry is currently empty.";

  const expired = items.filter((i) => daysUntilExpiry(i.expiry_date) < 0);
  const urgent  = items.filter((i) => { const d = daysUntilExpiry(i.expiry_date); return d >= 0 && d <= 2; });
  const warning = items.filter((i) => { const d = daysUntilExpiry(i.expiry_date); return d >= 3 && d <= 7; });
  const safe    = items.filter((i) => daysUntilExpiry(i.expiry_date) > 7);

  const fmt = (list: PantryItem[]) =>
    list.map((i) => {
      const d = daysUntilExpiry(i.expiry_date);
      const label = d < 0 ? `expired ${Math.abs(d)}d ago` : d === 0 ? "expires TODAY" : `${d}d left`;
      return `  • ${i.emoji} ${i.name} — ${i.quantity} ${i.unit} (${i.category}) [${label}]`;
    }).join("\n");

  const sections: string[] = [];
  if (expired.length)  sections.push(`🚫 EXPIRED (use or discard immediately):\n${fmt(expired)}`);
  if (urgent.length)   sections.push(`🔥 URGENT — expiring within 48 hours:\n${fmt(urgent)}`);
  if (warning.length)  sections.push(`⚠️  USE THIS WEEK (3–7 days):\n${fmt(warning)}`);
  if (safe.length)     sections.push(`✅ SAFE (more than 7 days):\n${fmt(safe)}`);

  return sections.join("\n\n");
}

/* ── System prompt ───────────────────────────────────────────────────────────── */
function buildSystemPrompt(items: PantryItem[]): string {
  return `You are the **GlowFood AI Chef** — a warm, knowledgeable, and creative culinary assistant specialised in zero-waste cooking. You were built for the GlowFood AI app by M Ali Asad Khan (FA24-BCS-120).

## Your Personality
- Friendly, encouraging, and concise — like a talented friend who happens to be a chef
- You ALWAYS prioritise ingredients that are closest to their expiry date
- You give practical, actionable advice the user can act on TODAY
- You add helpful emoji to make responses scannable and delightful
- You keep recipes realistic — no exotic ingredients the user doesn't have

## User's Current Pantry Inventory
${buildInventoryContext(items)}

## Your Core Rules
1. **Waste-first logic**: Always suggest recipes that use the most urgent / expiring items first
2. **Realistic recipes**: Only suggest recipes using ingredients the user actually has (or simple pantry staples like oil, salt, pepper, garlic)
3. **Format beautifully**: Use headers (##), bullet points, and bold text for readability
4. **Be specific**: Include approximate cook times, serving sizes, and key steps
5. **Close with a tip**: End every recipe suggestion with a storage or waste-reduction tip
6. **If asked non-food questions**: Gently redirect back to food, pantry, or sustainability topics

## Response Length
- Quick questions: 2–4 sentences
- Recipe requests: Full structured recipe with ingredients + steps
- Meal plan requests: Weekly overview with day-by-day breakdown`;
}

/* ── Route handler ───────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not set. Add it to your .env.local file." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { message, pantryItems = [], history = [] } = body as {
      message: string;
      pantryItems: PantryItem[];
      history: { role: "user" | "assistant"; content: string }[];
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    /* ── Initialise Groq ── */
    const groq = new Groq({ apiKey });

    /* ── Build conversation history ── */
    const messages = [
      {
        role: "system" as const,
        content: buildSystemPrompt(pantryItems),
      },
      ...history
        .slice(-10) // Keep last 10 turns
        .filter((h, idx) => !(h.role === "assistant" && idx === 0)) // Filter welcome message
        .map((h) => ({
          role: h.role === "user" ? ("user" as const) : ("assistant" as const),
          content: h.content,
        })),
      {
        role: "user" as const,
        content: message,
      },
    ];

    /* ── Send to Groq ── */
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Fast and smart model
      messages,
      temperature: 0.85,
      max_tokens: 1500,
      top_p: 0.95,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("[GlowFood Chat API]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
