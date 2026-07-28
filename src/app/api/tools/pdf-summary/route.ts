import { NextRequest, NextResponse } from "next/server";
import { getSession, checkAndConsumeCredit } from "@/lib/auth";
import { summarizePDF } from "@/lib/gemini";
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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;
    const language = (formData.get("language") as string) || "fr";

    let content = "";
    let fileName = "";

    if (file) {
      fileName = file.name;
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Extract text from PDF using pdf-parse
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
        const data = await pdfParse(buffer);
        content = data.text;
      } catch {
        // Fallback: try to read as plain text
        content = buffer.toString("utf-8");
      }
    } else if (text) {
      content = text;
    } else {
      return NextResponse.json(
        { error: "Fichier ou texte requis" },
        { status: 400 }
      );
    }

    if (content.length < 50) {
      return NextResponse.json(
        { error: "Le texte est trop court pour être résumé" },
        { status: 400 }
      );
    }

    const summary = await summarizePDF(content, language);

    await db.insert(generations).values({
      userId: session.userId,
      tool: "pdf_summary",
      inputText: content.substring(0, 500),
      outputText: summary,
      fileName: fileName || null,
      language,
    });

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("PDF summary error:", error);
    const message = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
