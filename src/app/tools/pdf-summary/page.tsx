"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Upload, X, Globe, Loader2, Copy, Download, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import MarkdownResult from "@/components/MarkdownResult";
import CreditBar from "@/components/CreditBar";

const LANGUAGES = [
  { value: "fr", label: "🇫🇷 Français" },
  { value: "en", label: "🇬🇧 Anglais" },
  { value: "es", label: "🇪🇸 Espagnol" },
  { value: "ar", label: "🇸🇦 Arabe" },
  { value: "de", label: "🇩🇪 Allemand" },
  { value: "pt", label: "🇵🇹 Portugais" },
];

export default function PDFSummaryPage() {
  const { user, loading, refetch } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [mode, setMode] = useState<"file" | "text">("file");
  const [language, setLanguage] = useState("fr");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleSubmit = async () => {
    if (mode === "file" && !file) { toast.error("Sélectionnez un fichier"); return; }
    if (mode === "text" && !textInput.trim()) { toast.error("Entrez du texte"); return; }

    setIsLoading(true);
    setResult("");
    try {
      const formData = new FormData();
      formData.append("language", language);
      if (mode === "file" && file) formData.append("file", file);
      else formData.append("text", textInput);

      const res = await fetch("/api/tools/pdf-summary", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erreur");
        if (res.status === 401) router.push("/login");
      } else {
        setResult(data.summary);
        refetch();
        toast.success("Résumé généré !");
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
    a.download = "resume-liora.txt";
    a.click();
  };

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={36} color="#7c3aed" style={{ animation: "spin 0.7s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            <span>Outils</span><ChevronRight size={14} /><span style={{ color: "#7c3aed", fontWeight: 600 }}>Résumeur PDF</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ width: "44px", height: "44px", background: "rgba(124,58,237,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={22} color="#7c3aed" />
            </div>
            <div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>Résumeur PDF & Articles</h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Résumé structuré en quelques secondes</p>
            </div>
          </div>
        </div>

        <CreditBar user={user} />

        {/* Input panel */}
        <div className="glass-card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
          {/* Mode tabs */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {(["file", "text"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: "0.5rem 1.2rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                  ...(mode === m
                    ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white", borderColor: "transparent" }
                    : { background: "var(--bg-secondary)", color: "var(--text-muted)" }),
                }}
              >
                {m === "file" ? "📄 Fichier PDF" : "✍️ Coller du texte"}
              </button>
            ))}
          </div>

          {/* File dropzone */}
          {mode === "file" && (
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? "#7c3aed" : "var(--border)"}`,
                borderRadius: "12px",
                padding: "3rem 2rem",
                textAlign: "center",
                cursor: "pointer",
                background: isDragActive ? "rgba(124,58,237,0.05)" : "var(--bg-secondary)",
                transition: "all 0.2s",
                marginBottom: "1.5rem",
              }}
            >
              <input {...getInputProps()} />
              {file ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <FileText size={24} color="#7c3aed" />
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{file.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <Upload size={36} color="#7c3aed" style={{ marginBottom: "1rem" }} />
                  <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
                    {isDragActive ? "Déposez ici !" : "Glissez-déposez votre PDF"}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                    ou cliquez pour sélectionner · PDF, TXT · Max 10 Mo
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Text input */}
          {mode === "text" && (
            <textarea
              className="input-field"
              placeholder="Collez votre texte ou article ici... (minimum 50 caractères)"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              style={{ minHeight: "200px", resize: "vertical", marginBottom: "1.5rem", fontFamily: "inherit" }}
            />
          )}

          {/* Language select */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Globe size={16} color="#7c3aed" />
              <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>
                Langue du résumé :
              </label>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field"
              style={{ width: "auto", minWidth: "160px" }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>

            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
              style={{ marginLeft: "auto" }}
            >
              {isLoading ? <><span className="spinner" /> Analyse en cours...</> : "✨ Résumer maintenant"}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="glass-card fade-in-up" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h2 style={{ fontWeight: 700, color: "var(--text)", fontSize: "1.1rem" }}>📋 Résumé généré</h2>
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
