import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
        padding: "3rem 1.5rem 2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  borderRadius: "7px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={15} color="white" />
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Liora
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
              L&apos;IA au service de vos documents. Propulsé par Groq.
            </p>
          </div>

          {/* Outils */}
          <div>
            <h4
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Outils
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { href: "/tools/pdf-summary", label: "Résumeur PDF" },
                { href: "/tools/cv-generator", label: "Générateur CV" },
                { href: "/tools/text-corrector", label: "Correcteur texte" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    style={{
                      color: "var(--text-muted)",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      transition: "color 0.2s",
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compte */}
          <div>
            <h4
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Compte
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { href: "/register", label: "S'inscrire" },
                { href: "/login", label: "Se connecter" },
                { href: "/pricing", label: "Tarifs" },
                { href: "/dashboard", label: "Dashboard" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    style={{
                      color: "var(--text-muted)",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Légal
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { href: "#", label: "Confidentialité" },
                { href: "#", label: "CGU" },
                { href: "#", label: "Mentions légales" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    style={{
                      color: "var(--text-muted)",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} Liora. Tous droits réservés.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            Fait avec ❤️ · Propulsé par Groq AI
          </p>
        </div>
      </div>
    </footer>
  );
}
