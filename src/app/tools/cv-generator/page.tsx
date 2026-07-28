"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase, Loader2, Copy, Download, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import MarkdownResult from "@/components/MarkdownResult";
import CreditBar from "@/components/CreditBar";

const LANGUAGES = [
  { value: "fr", label: "🇫🇷 Français" },
  { value: "en", label: "🇬🇧 Anglais" },
  { value: "es", label: "🇪🇸 Espagnol" },
];

const TONES = [
  { value: "formal", label: "Formel & Professionnel" },
  { value: "modern", label: "Moderne & Assertif" },
  { value: "creative", label: "Créatif & Dynamique" },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  targetJob: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  tone: string;
  outputLanguage: string;
}

export default function CVGeneratorPage() {
  const { user, loading, refetch } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cvResult, setCvResult] = useState("");
  const [clResult, setClResult] = useState("");
  const [activeTab, setActiveTab] = useState<"cv" | "cl">("cv");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    targetJob: "",
    experience: "",
    education: "",
    skills: "",
    languages: "",
    tone: "modern",
    outputLanguage: "fr",
  });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const update = (field: keyof FormData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name || !form.targetJob || !form.experience) {
      toast.error("Remplissez au moins : nom, poste visé et expériences");
      return;
    }
    setIsLoading(true);
    setCvResult("");
    setClResult("");
    try {
      const res = await fetch("/api/tools/cv-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erreur");
        if (res.status === 401) router.push("/login");
      } else {
        setCvResult(data.cv);
        setClResult(data.coverLetter);
        refetch();
        toast.success("CV & Lettre générés !");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié !");
  };

  const downloadResult = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={36} color="#7c3aed" style={{ animation: "spin 0.7s linear infinite" }} />
      </div>
    );
  }

  const inputStyle = { marginBottom: "1.25rem" };
  const labelStyle = { display: "block" as const, fontSize: "0.875rem", fontWeight: 600 as const, color: "var(--text)", marginBottom: "0.4rem" };
  const hintStyle = { fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            <span>Outils</span><ChevronRight size={14} /><span style={{ color: "#06b6d4", fontWeight: 600 }}>Générateur CV</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ width: "44px", height: "44px", background: "rgba(6,182,212,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Briefcase size={22} color="#06b6d4" />
            </div>
            <div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>Générateur CV & Lettre de motivation</h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>CV professionnel + lettre percutante en quelques secondes</p>
            </div>
          </div>
        </div>

        <CreditBar user={user} />

        {/* Form */}
        <div className="glass-card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, color: "var(--text)", marginBottom: "1.5rem", fontSize: "1rem" }}>
            👤 Informations personnelles
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 1.25rem" }}>
            <div style={inputStyle}>
              <label style={labelStyle}>Prénom & Nom *</label>
              <input className="input-field" placeholder="Marie Dupont" value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div style={inputStyle}>
              <label style={labelStyle}>Email</label>
              <input className="input-field" type="email" placeholder="marie@exemple.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div style={inputStyle}>
              <label style={labelStyle}>Téléphone</label>
              <input className="input-field" placeholder="+33 6 12 34 56 78" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div style={inputStyle}>
              <label style={labelStyle}>Ville / Adresse</label>
              <input className="input-field" placeholder="Paris, France" value={form.address} onChange={(e) => update("address", e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 1.25rem" }}>
            <div style={inputStyle}>
              <label style={labelStyle}>Titre actuel / profil</label>
              <input className="input-field" placeholder="Développeur Full-Stack Senior" value={form.title} onChange={(e) => update("title", e.target.value)} />
            </div>
            <div style={inputStyle}>
              <label style={labelStyle}>Poste visé *</label>
              <input className="input-field" placeholder="Lead Developer chez Startup FinTech" value={form.targetJob} onChange={(e) => update("targetJob", e.target.value)} />
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginTop: "0.5rem" }}>
            <h2 style={{ fontWeight: 700, color: "var(--text)", marginBottom: "1.25rem", fontSize: "1rem" }}>
              💼 Expériences & Formation
            </h2>
            <div style={inputStyle}>
              <label style={labelStyle}>Expériences professionnelles *</label>
              <textarea
                className="input-field"
                placeholder="Ex : 2020–2024 : Développeur chez TechCorp — Création d'une app mobile (50k users), optimisation DB (-40% temps de chargement)..."
                value={form.experience}
                onChange={(e) => update("experience", e.target.value)}
                style={{ minHeight: "120px", resize: "vertical", fontFamily: "inherit" }}
              />
              <p style={hintStyle}>Plus c'est détaillé (chiffres, résultats), meilleur sera le CV</p>
            </div>

            <div style={inputStyle}>
              <label style={labelStyle}>Formation</label>
              <textarea
                className="input-field"
                placeholder="Ex : Master Informatique — Université Paris-Saclay (2020)"
                value={form.education}
                onChange={(e) => update("education", e.target.value)}
                style={{ minHeight: "80px", resize: "vertical", fontFamily: "inherit" }}
              />
            </div>
          </div>

          {/* Advanced section */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", color: "#7c3aed", fontWeight: 600, fontSize: "0.9rem", marginBottom: "1rem" }}
          >
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showAdvanced ? "Masquer" : "Options avancées"} (compétences, langues, ton)
          </button>

          {showAdvanced && (
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 1.25rem" }}>
                <div style={inputStyle}>
                  <label style={labelStyle}>Compétences techniques</label>
                  <textarea
                    className="input-field"
                    placeholder="React, Node.js, PostgreSQL, Docker, AWS..."
                    value={form.skills}
                    onChange={(e) => update("skills", e.target.value)}
                    style={{ minHeight: "80px", resize: "vertical", fontFamily: "inherit" }}
                  />
                </div>
                <div style={inputStyle}>
                  <label style={labelStyle}>Langues parlées</label>
                  <textarea
                    className="input-field"
                    placeholder="Français (natif), Anglais (C1), Espagnol (B2)..."
                    value={form.languages}
                    onChange={(e) => update("languages", e.target.value)}
                    style={{ minHeight: "80px", resize: "vertical", fontFamily: "inherit" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 1.25rem" }}>
                <div style={inputStyle}>
                  <label style={labelStyle}>Langue du document</label>
                  <select className="input-field" value={form.outputLanguage} onChange={(e) => update("outputLanguage", e.target.value)}>
                    {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
                <div style={inputStyle}>
                  <label style={labelStyle}>Ton & Style</label>
                  <select className="input-field" value={form.tone} onChange={(e) => update("tone", e.target.value)}>
                    {TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
            style={{ width: "100%", justifyContent: "center", padding: "0.9rem", fontSize: "1rem", marginTop: "0.5rem" }}
          >
            {isLoading ? <><span className="spinner" /> Génération en cours (15–30s)...</> : "✨ Générer mon CV & Lettre"}
          </button>
        </div>

        {/* Results */}
        {(cvResult || clResult) && (
          <div className="glass-card fade-in-up" style={{ padding: "2rem" }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
              {(["cv", "cl"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "0.5rem 1.2rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    transition: "all 0.2s",
                    ...(activeTab === tab
                      ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white", borderColor: "transparent" }
                      : { background: "var(--bg-secondary)", color: "var(--text-muted)" }),
                  }}
                >
                  {tab === "cv" ? "📄 CV" : "✉️ Lettre de motivation"}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginBottom: "1rem" }}>
              <button
                className="btn-secondary"
                onClick={() => copyResult(activeTab === "cv" ? cvResult : clResult)}
                style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
              >
                <Copy size={14} /> Copier
              </button>
              <button
                className="btn-secondary"
                onClick={() => downloadResult(activeTab === "cv" ? cvResult : clResult, activeTab === "cv" ? "cv-liora.txt" : "lettre-liora.txt")}
                style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
              >
                <Download size={14} /> Télécharger
              </button>
            </div>

            <MarkdownResult content={activeTab === "cv" ? cvResult : clResult} />
          </div>
        )}
      </div>
    </div>
  );
}
