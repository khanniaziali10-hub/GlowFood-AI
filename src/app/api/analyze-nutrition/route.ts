import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

/**
 * AI-Powered Nutritional Analysis API
 * Uses Gemini to analyze nutritional content and provide health insights
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
    const { ingredients, dietaryPreferences = [] } = body as {
      ingredients: string[];
      dietaryPreferences?: string[];
    };

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "Ingredients list is required" },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey });

    const dietaryContext = dietaryPreferences.length > 0
      ? `\n\nDietary preferences: ${dietaryPreferences.join(", ")}`
      : "";

    const prompt = `Analyze the nutritional content of these ingredients and provide health insights:

Ingredients: ${ingredients.join(", ")}${dietaryContext}

Provide a structured analysis with:
1. **Estimated Calories**: Total approximate calories
2. **Macronutrients**: Protein, Carbs, Fats breakdown
3. **Key Vitamins & Minerals**: Most significant nutrients
4. **Health Benefits**: Top 3 health benefits
5. **Dietary Compatibility**: Suitable for (vegan, vegetarian, keto, etc.)
6. **Recommendations**: Any health tips or warnings

Keep it concise and practical. Use bullet points.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysis = completion.choices[0]?.message?.content || "Unable to analyze nutrition.";

    return NextResponse.json({ analysis });
  } catch (err: unknown) {
    console.error("[Nutrition Analysis API]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
