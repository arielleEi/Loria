"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Loader2, Copy, Download, ChevronRight, Globe } from "lucide-react";
import toast from "react-hot-toast";
import MarkdownResult from "@/components/MarkdownResult";
import CreditBar from "@/components/CreditBar";

const MODES = [
  {
    id: "correct",
    label: "✏️ Corriger",
    desc: "Fautes d'orthographe & grammaire",
    color: "#7c3aed",
  },
  {
    id: "rephrase",
    label: "🔄 Reformuler",
    desc: "2 versions alternatives",
    color: "#06b6d4",
  },
  {
    id: "formal",
    label: "🎩 Formaliser",
    desc: "Registre professionnel",
    color: "#10b981",
  },
  {
    id: "simplify",
    label: "💡 Simplifier",
    desc: "Texte accessible à tous",
    color: "#f59e0b",
  },
] as const;

const LANGUAGES = [
  { value: "fr", label: "🇫🇷 Français" },
  { value: "en", label: "🇬🇧 Anglais" },
  { value: "es", label: "🇪🇸 Espagnol" },
  { value: "ar", label: "🇸🇦 Arabe" },
  { value: "de", label: "🇩🇪 Allemand" },
  { value: "pt", label: "🇵🇹 Portugais" },
];

type ModeId = "correct" | "rephrase" | "formal" | "simplify";

export default function TextCorrectorPage() {
  const { user, loading, refetch } = useAuth();
  const router = useRouter();
  const [text, setText] = useState("");
  const [mode, setMode] = useState<ModeId>("correct");
  const [language, setLanguage] = useState("fr");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleSubmit = async () => {
    if (!text.trim() || text.trim().length < 5) {
      toast.error("Entrez au moins 5 caractères");
      return;
    }
    setIsLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/tools/text-corrector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erreur");
        if (res.status === 401) router.push("/login");
      } else {
        setResult(data.result);
        refetch();
        toast.success("Texte traité !");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copié !");
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "texte-liora.txt";
    a.click();
  };

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={36} color="#7c3aed" style={{ animation: "spin 0.7s linear infinite" }} />
      </div>
    );
  }

  const selectedMode = MODES.find((m) => m.id === mode)!;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            <span>Outils</span><ChevronRight size={14} /><span style={{ color: "#10b981", fontWeight: 600 }}>Correcteur texte</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ width: "44px", height: "44px", background: "rgba(16,185,129,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Pencil size={22} color="#10b981" />
            </div>
            <div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>Correcteur & Reformulateur</h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Correction, reformulation, formalisation — multi-langue</p>
            </div>
          </div>
        </div>

        <CreditBar user={user} />

        {/* Mode selector */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                padding: "0.9rem 0.75rem",
                borderRadius: "12px",
                border: `2px solid ${mode === m.id ? m.color : "var(--border)"}`,
                cursor: "pointer",
                background: mode === m.id ? `${m.color}15` : "var(--bg-card)",
                transition: "all 0.2s",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: mode === m.id ? m.color : "var(--text)", marginBottom: "0.2rem" }}>
                {m.label}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{m.desc}</div>
            </button>
          ))}
        </div>

        {/* Input & settings */}
        <div className="glass-card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
          {/* Text area */}
          <div style={{ position: "relative", marginBottom: "1.25rem" }}>
            <textarea
              className="input-field"
              placeholder={`Entrez votre texte à ${mode === "correct" ? "corriger" : mode === "rephrase" ? "reformuler" : mode === "formal" ? "formaliser" : "simplifier"}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ minHeight: "220px", resize: "vertical", fontFamily: "inherit", paddingBottom: "2.5rem" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "0.75rem",
                right: "1rem",
                fontSize: "0.75rem",
                color: charCount > 4000 ? "#ef4444" : "var(--text-muted)",
              }}
            >
              {wordCount} mots · {charCount} caractères
            </div>
          </div>

          {/* Language & submit */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Globe size={16} color={selectedMode.color} />
              <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>Langue :</label>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field"
              style={{ width: "auto", minWidth: "160px" }}
            >
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>

            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
              style={{ marginLeft: "auto", background: `linear-gradient(135deg, ${selectedMode.color}, ${selectedMode.color}cc)` }}
            >
              {isLoading ? <><span className="spinner" /> Traitement...</> : `${selectedMode.label} →`}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="glass-card fade-in-up" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h2 style={{ fontWeight: 700, color: "var(--text)", fontSize: "1.1rem" }}>
                {selectedMode.label} — Résultat
              </h2>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn-secondary" onClick={copyResult} style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
                  <Copy size={14} /> Copier
                </button>
                <button className="btn-secondary" onClick={downloadResult} style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
                  <Download size={14} /> Télécharger
                </button>
              </div>
            </div>
            <MarkdownResult content={result} />
          </div>
        )}
      </div>
    </div>
  );
}
