import { NextRequest, NextResponse } from "next/server";
import { getSession, checkAndConsumeCredit } from "@/lib/auth";
import { correctText } from "@/lib/gemini";
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

    const { text, mode, language } = await req.json();

    if (!text || text.trim().length < 5) {
      return NextResponse.json(
        { error: "Texte trop court" },
        { status: 400 }
      );
    }

    const result = await correctText(text, mode, language);

    await db.insert(generations).values({
      userId: session.userId,
      tool: "text_corrector",
      inputText: text.substring(0, 500),
      outputText: result.substring(0, 2000),
      language,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Text corrector error:", error);
    const message = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
