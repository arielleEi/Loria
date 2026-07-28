async function callGroq(prompt: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key || key === "your_groq_api_key_here") {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function summarizePDF(text: string, language = "fr"): Promise<string> {
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

  return callGroq(prompt);
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

  const [cv, coverLetter] = await Promise.all([callGroq(cvPrompt), callGroq(clPrompt)]);

  return { cv, coverLetter };
}

export async function correctText(
  text: string,
  mode: "correct" | "rephrase" | "formal" | "simplify",
  language = "fr"
): Promise<string> {
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

  return callGroq(prompt);
}
