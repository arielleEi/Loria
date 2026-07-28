"use client";
import Link from "next/link";
import { FileText, Briefcase, Pencil, ArrowRight, Zap } from "lucide-react";

const tools = [
  {
    icon: FileText,
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.1)",
    title: "Résumeur de PDF",
    description:
      "Glissez-déposez votre PDF ou article et obtenez un résumé structuré en quelques secondes. Supporte le multilingue.",
    features: ["Résumé exécutif", "Points clés extraits", "Conclusion synthétisée", "Multi-langue"],
    href: "/tools/pdf-summary",
    tag: "Populaire",
  },
  {
    icon: Briefcase,
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.1)",
    title: "Générateur CV & Lettre",
    description:
      "Entrez vos informations et l'IA génère un CV professionnel et une lettre de motivation percutante, adaptés au poste.",
    features: ["CV en Markdown", "Lettre de motivation", "Plusieurs langues", "Ton personnalisable"],
    href: "/tools/cv-generator",
    tag: "Pro",
  },
  {
    icon: Pencil,
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    title: "Correcteur & Reformulateur",
    description:
      "Corrigez l'orthographe, reformulez, formalisez ou simplifiez votre texte en français, anglais, espagnol, arabe et plus.",
    features: ["Correction orthographe", "Reformulation ×2", "Registre formel", "Simplification"],
    href: "/tools/text-corrector",
    tag: "Multi-langue",
  },
];

export default function ToolsSection() {
  return (
    <section
      id="tools"
      style={{
        padding: "5rem 1.5rem",
        background: "var(--bg-secondary)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(124,58,237,0.1)",
              color: "#7c3aed",
              borderRadius: "20px",
              padding: "0.3rem 0.9rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            <Zap size={13} />
            Trois outils, une interface
          </div>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--text)",
              marginBottom: "1rem",
            }}
          >
            Tout ce dont vous avez besoin
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Des outils IA conçus pour gagner du temps et améliorer la qualité de vos documents.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {tools.map((tool) => (
            <div key={tool.title} className="glass-card" style={{ padding: "2rem" }}>
              {/* Icon + Tag */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    background: tool.bg,
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <tool.icon size={24} color={tool.color} />
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    background: tool.bg,
                    color: tool.color,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "20px",
                  }}
                >
                  {tool.tag}
                </span>
              </div>

              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "0.75rem",
                }}
              >
                {tool.title}
              </h3>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  marginBottom: "1.25rem",
                }}
              >
                {tool.description}
              </p>

              <ul
                style={{
                  listStyle: "none",
                  marginBottom: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                {tool.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ color: tool.color, fontWeight: 700 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={tool.href}>
                <button
                  className="btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${tool.color}, ${tool.color}cc)`,
                  }}
                >
                  Utiliser l&apos;outil
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
