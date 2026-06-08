import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { PantryItem } from "@/types";

/**
 * AI-Powered Smart Suggestions API
 * Provides intelligent recommendations for meal planning, shopping, and food storage
 */
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { pantryItems, suggestionType = "meal-plan" } = body as {
      pantryItems: PantryItem[];
      suggestionType: "meal-plan" | "shopping-list" | "storage-tips" | "waste-reduction";
    };

    if (!pantryItems || pantryItems.length === 0) {
      return NextResponse.json(
        { error: "Pantry items are required" },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey });

    // Build context from pantry
    const itemsList = pantryItems
      .map((item) => {
        const daysLeft = Math.ceil(
          (new Date(item.expiry_date).getTime() - new Date().getTime()) / 86400000
        );
        return `${item.emoji} ${item.name} (${item.quantity} ${item.unit}, expires in ${daysLeft} days)`;
      })
      .join("\n");

    const prompts = {
      "meal-plan": `Create a 3-day meal plan using these pantry items. Prioritize items expiring soonest.

Current Pantry:
${itemsList}

Provide:
- **Day 1**: Breakfast, Lunch, Dinner
- **Day 2**: Breakfast, Lunch, Dinner  
- **Day 3**: Breakfast, Lunch, Dinner

Include which pantry items are used in each meal. Keep it realistic and delicious!`,

      "shopping-list": `Based on this pantry, suggest a smart shopping list to complement what I have.

Current Pantry:
${itemsList}

Provide:
- **Essential Items**: Must-buy items to complete meals
- **Recommended Items**: Nice-to-have for variety
- **Avoid Buying**: Items I already have enough of

Focus on items that work well with my current inventory.`,

      "storage-tips": `Provide expert storage tips for these pantry items to maximize freshness.

Current Pantry:
${itemsList}

For each category, provide:
- **Best Storage Method**: Fridge, freezer, pantry, etc.
- **Pro Tips**: How to extend shelf life
- **Warning Signs**: When to discard

Be specific and practical.`,

      "waste-reduction": `Analyze my pantry and provide waste reduction strategies.

Current Pantry:
${itemsList}

Provide:
- **Urgent Actions**: Items to use immediately
- **Preservation Ideas**: Freezing, pickling, etc.
- **Creative Uses**: Unusual ways to use items
- **Composting Guide**: What can be composted

Help me waste nothing!`,
    };

    const prompt = prompts[suggestionType];
    
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 1200,
    });

    const suggestions = completion.choices[0]?.message?.content || "Unable to generate suggestions.";

    return NextResponse.json({ suggestions, type: suggestionType });
  } catch (err: unknown) {
    console.error("[Smart Suggestions API]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
