"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, Zap, Crown, CreditCard } from "lucide-react";

const freeFeatures = [
  "20 générations IA / mois",
  "Résumé PDF (jusqu'à 10 pages)",
  "Générateur CV de base",
  "Correcteur de texte",
  "Support email",
];

const proFeatures = [
  "300 générations IA / mois",
  "Résumé PDF illimité (taille)",
  "CV + Lettre de motivation pro",
  "Tous les modes de correction",
  "Multi-langue (6 langues)",
  "Historique des générations",
  "Annulation en 1 clic",
  "Support prioritaire",
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section
      id="pricing"
      style={{ padding: "5rem 1.5rem", background: "var(--bg)" }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--text)",
              marginBottom: "1rem",
            }}
          >
            Prix clairs,{" "}
            <span className="gradient-text">sans surprise</span>
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              marginBottom: "2rem",
            }}
          >
            Pas de renouvellement caché. Annulation en 1 clic. Plan gratuit réel.
          </p>

          {/* Toggle monthly/yearly */}
          <div
            style={{
              display: "inline-flex",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "4px",
              gap: "4px",
            }}
          >
            <button
              onClick={() => setIsYearly(false)}
              style={{
                padding: "0.45rem 1.2rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                transition: "all 0.2s",
                ...(isYearly
                  ? { background: "transparent", color: "var(--text-muted)" }
                  : {
                      background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                      color: "white",
                    }),
              }}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsYearly(true)}
              style={{
                padding: "0.45rem 1.2rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                ...(isYearly
                  ? {
                      background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                      color: "white",
                    }
                  : { background: "transparent", color: "var(--text-muted)" }),
              }}
            >
              Annuel
              <span
                style={{
                  background: "rgba(6,182,212,0.2)",
                  color: "#06b6d4",
                  borderRadius: "8px",
                  padding: "0.1rem 0.4rem",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                −17%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* Free Plan */}
          <div className="glass-card" style={{ padding: "2rem" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <Zap size={20} color="#64748b" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)" }}>
                  Gratuit
                </h3>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                <span
                  style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--text)" }}
                >
                  0€
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  / mois
                </span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                Pour découvrir sans engagement
              </p>
            </div>

            <ul style={{ listStyle: "none", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {freeFeatures.map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                  }}
                >
                  <Check size={15} color="#10b981" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/register">
              <button className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                Commencer gratuitement
              </button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div
            style={{
              background: "linear-gradient(135deg, #4c1d95, #1e3a5f)",
              border: "1px solid rgba(124,58,237,0.5)",
              borderRadius: "16px",
              padding: "2rem",
              position: "relative",
              boxShadow: "0 12px 40px rgba(124,58,237,0.3)",
            }}
          >
            {/* Popular badge */}
            <div
              style={{
                position: "absolute",
                top: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                color: "white",
                padding: "0.25rem 1rem",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              ⭐ Plus populaire
            </div>

            <div style={{ marginBottom: "1.5rem", marginTop: "0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <Crown size={20} color="#a78bfa" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>
                  Pro
                </h3>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "white" }}>
                  {isYearly ? "6,58€" : "7,90€"}
                </span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
                  / mois
                </span>
              </div>
              {isYearly && (
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                  Facturé 79€/an · Économisez 15,80€
                </p>
              )}
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", marginTop: "0.4rem" }}>
                Pour une utilisation régulière
              </p>
            </div>

            <ul style={{ listStyle: "none", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {proFeatures.map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  <Check size={15} color="#a78bfa" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/register">
              <button
                style={{
                  width: "100%",
                  background: "white",
                  color: "#7c3aed",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s",
                }}
              >
                <Crown size={16} />
                Passer à Pro
              </button>
            </Link>
          </div>

          {/* Credits card */}
          <div className="glass-card" style={{ padding: "2rem" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <CreditCard size={20} color="#06b6d4" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)" }}>
                  Crédits à la carte
                </h3>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--text)" }}>
                  2,90€
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  / 50 crédits
                </span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                Pour ceux qui n&apos;aiment pas les abonnements
              </p>
            </div>

            <ul style={{ listStyle: "none", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                "50 crédits par achat",
                "Pas d'abonnement",
                "Valable 1 an",
                "Tous les outils inclus",
                "Achetez quand vous voulez",
              ].map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                  }}
                >
                  <Check size={15} color="#06b6d4" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/register">
              <button
                className="btn-secondary"
                style={{ width: "100%", justifyContent: "center", borderColor: "rgba(6,182,212,0.3)" }}
              >
                Acheter des crédits
              </button>
            </Link>
          </div>
        </div>

        {/* Trust footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "2.5rem",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <span>🔒 Paiement sécurisé par Stripe</span>
          <span>↩️ Annulation en 1 clic</span>
          <span>💳 CB, Apple Pay, Google Pay</span>
        </div>
      </div>
    </section>
  );
}
