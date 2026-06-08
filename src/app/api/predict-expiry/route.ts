import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI-Powered Expiry Prediction API
 * Uses Gemini to predict shelf life based on storage conditions and food type
 */
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { foodName, storageCondition = "refrigerated", openedDate } = body as {
      foodName: string;
      storageCondition?: "room-temperature" | "refrigerated" | "frozen";
      openedDate?: string;
    };

    if (!foodName) {
      return NextResponse.json(
        { error: "Food name is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.5,
        topP: 0.9,
        maxOutputTokens: 800,
      },
    });

    const openedContext = openedDate
      ? `\nThe package was opened on: ${openedDate}`
      : "\nThe package is unopened.";

    const prompt = `As a food safety expert, predict the shelf life for this food item:

Food: ${foodName}
Storage: ${storageCondition}${openedContext}

Provide:
1. **Estimated Shelf Life**: Number of days (be specific)
2. **Optimal Storage**: Best practices for this item
3. **Freshness Indicators**: How to tell if it's still good
4. **Safety Warning**: When to definitely discard
5. **Extension Tips**: How to make it last longer

Be accurate and prioritize food safety. Format as structured bullet points.`;

    const result = await model.generateContent(prompt);
    const prediction = result.response.text();

    // Extract estimated days using regex (if AI provides a number)
    const daysMatch = prediction.match(/(\d+)\s*days?/i);
    const estimatedDays = daysMatch ? parseInt(daysMatch[1]) : null;

    return NextResponse.json({
      prediction,
      estimatedDays,
      foodName,
      storageCondition,
    });
  } catch (err: unknown) {
    console.error("[Expiry Prediction API]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
