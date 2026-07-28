import { GoogleGenerativeAI } from "@google/generative-ai";

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenerativeAI(key);
}

export async function summarizePDF(text: string, language = "fr"): Promise<string> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Tu es un expert en synthèse de documents. Résume le document suivant en ${language === "fr" ? "français" : language === "en" ? "anglais" : language === "es" ? "espagnol" : language === "ar" ? "arabe" : "français"}.

Structure ta réponse ainsi :
## 📋 Résumé exécutif
(2-3 phrases clés)

## 🎯 Points principaux
(liste des idées maîtresses, max 7 points)

## 💡 Conclusion
(synthèse finale)

Document à résumer :
${text.substring(0, 8000)}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateCV(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  targetJob: string;
  tone: string;
  outputLanguage: string;
}): Promise<{ cv: string; coverLetter: string }> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const lang = data.outputLanguage === "fr" ? "français" : data.outputLanguage === "en" ? "anglais" : data.outputLanguage === "es" ? "espagnol" : "français";
  const toneStr = data.tone === "formal" ? "formel et professionnel" : data.tone === "creative" ? "créatif et dynamique" : "moderne et assertif";

  const cvPrompt = `Génère un CV professionnel en ${lang} au format Markdown, ton ${toneStr}, pour ce profil :
Nom: ${data.name}
Email: ${data.email}
Téléphone: ${data.phone}
Adresse: ${data.address}
Titre: ${data.title}
Poste visé: ${data.targetJob}
Expériences: ${data.experience}
Formation: ${data.education}
Compétences: ${data.skills}
Langues: ${data.languages}

Crée un CV structuré, percutant, avec des bullet points d'impact (chiffres, résultats). Format : sections claires avec emojis discrets.`;

  const clPrompt = `Génère une lettre de motivation professionnelle en ${lang}, ton ${toneStr}, pour :
Candidat : ${data.name}, ${data.title}
Poste visé : ${data.targetJob}
Expériences clés : ${data.experience}
Compétences : ${data.skills}

La lettre doit : accroche forte, 3 paragraphes (motivation, valeur ajoutée, appel à l'action), max 350 mots, personnalisée et convaincante.`;

  const [cvResult, clResult] = await Promise.all([
    model.generateContent(cvPrompt),
    model.generateContent(clPrompt),
  ]);

  return {
    cv: cvResult.response.text(),
    coverLetter: clResult.response.text(),
  };
}

export async function correctText(
  text: string,
  mode: "correct" | "rephrase" | "formal" | "simplify",
  language = "fr"
): Promise<string> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const lang = language === "fr" ? "français" : language === "en" ? "anglais" : language === "es" ? "espagnol" : language === "ar" ? "arabe" : language === "de" ? "allemand" : "français";

  const modeInstructions: Record<string, string> = {
    correct: `Corrige UNIQUEMENT les fautes d'orthographe, grammaire et ponctuation en ${lang}. Conserve le style et le sens original. Retourne uniquement le texte corrigé, puis liste les corrections en dessous sous "📝 Corrections apportées :".`,
    rephrase: `Reformule ce texte en ${lang} pour le rendre plus fluide et naturel, sans changer le sens. Propose 2 versions différentes numérotées.`,
    formal: `Transforme ce texte en ${lang} dans un registre formel/professionnel. Retourne uniquement la version formelle.`,
    simplify: `Simplifie ce texte en ${lang} pour le rendre accessible à tous, en conservant les informations essentielles. Retourne le texte simplifié.`,
  };

  const prompt = `${modeInstructions[mode]}

Texte :
"${text}"`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
