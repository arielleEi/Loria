import { NextRequest, NextResponse } from "next/server";
import { getSession, checkAndConsumeCredit } from "@/lib/auth";
import { generateCV } from "@/lib/gemini";
import { db } from "@/db";
import { generations } from "@/db/schema";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const creditCheck = await checkAndConsumeCredit(session.userId);
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.message }, { status: 403 });
    }

    const body = await req.json();
    const result = await generateCV(body);

    await db.insert(generations).values({
      userId: session.userId,
      tool: "cv_generator",
      inputText: JSON.stringify(body).substring(0, 500),
      outputText: result.cv.substring(0, 2000),
      language: body.outputLanguage,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("CV generator error:", error);
    const message = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
