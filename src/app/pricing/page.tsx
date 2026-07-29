"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Check, Crown, Zap, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

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

const freeFeatures = [
  "20 générations IA / mois",
  "Résumé PDF (jusqu'à 10 pages)",
  "Générateur CV de base",
  "Correcteur de texte",
  "Support email",
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      window.location.href = "/register";
      return;
    }
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Erreur lors de la création du paiement");
      }
    } catch {
      toast.error("Erreur serveur");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 900,
                color: "var(--text)",
                marginBottom: "1rem",
              }}
            >
              Prix clairs,{" "}
              <span className="gradient-text">sans surprise</span>
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "2rem" }}>
              Annulation en 1 clic. Plan gratuit réel (pas un piège à carte bancaire).
            </p>

            {/* Toggle */}
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
                  padding: "0.5rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
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
                  padding: "0.5rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
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
                    background: "rgba(6,182,212,0.25)",
                    color: "#06b6d4",
                    borderRadius: "6px",
                    padding: "0.1rem 0.4rem",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  −17%
                </span>
              </button>
            </div>
          </div>

          {/* Plans grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
              alignItems: "start",
            }}
          >
            {/* Free */}
            <div className="glass-card" style={{ padding: "2.5rem" }}>
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <Zap size={22} color="#64748b" />
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)" }}>Gratuit</h2>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                  <span style={{ fontSize: "3rem", fontWeight: 900, color: "var(--text)" }}>0€</span>
                  <span style={{ color: "var(--text-muted)" }}>/ mois</span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  Pour commencer sans engagement
                </p>
              </div>
              <ul style={{ listStyle: "none", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {freeFeatures.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    <Check size={16} color="#10b981" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <button className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "0.8rem" }}>
                  Commencer gratuitement
                </button>
              </Link>
            </div>

            {/* Pro */}
            <div
              style={{
                background: "linear-gradient(160deg, #3b1073 0%, #0f2a45 100%)",
                border: "1px solid rgba(167,139,250,0.3)",
                borderRadius: "16px",
                padding: "2.5rem",
                position: "relative",
                boxShadow: "0 20px 60px rgba(124,58,237,0.3)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  color: "white",
                  padding: "0.3rem 1.2rem",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                ⭐ Recommandé
              </div>

              <div style={{ marginBottom: "2rem", marginTop: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <Crown size={22} color="#a78bfa" />
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "white" }}>Pro</h2>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                  <span style={{ fontSize: "3rem", fontWeight: 900, color: "white" }}>
                    {isYearly ? "6,58€" : "7,90€"}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>/ mois</span>
                </div>
                {isYearly ? (
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", marginTop: "0.4rem" }}>
                    Facturé 79€/an · Économisez 15,80€
                  </p>
                ) : (
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", marginTop: "0.4rem" }}>
                    Ou 79€/an (économisez 15,80€)
                  </p>
                )}
              </div>

              <ul style={{ listStyle: "none", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {proFeatures.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>
                    <Check size={16} color="#a78bfa" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(isYearly ? "pro_yearly" : "pro_monthly")}
                disabled={loadingPlan !== null || user?.plan === "pro"}
                style={{
                  width: "100%",
                  background: "white",
                  color: "#7c3aed",
                  padding: "0.9rem",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: user?.plan === "pro" ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  opacity: user?.plan === "pro" ? 0.7 : 1,
                }}
              >
                {loadingPlan ? (
                  <span className="spinner" style={{ borderTopColor: "#7c3aed", borderColor: "rgba(124,58,237,0.2)" }} />
                ) : user?.plan === "pro" ? (
                  "✓ Plan actuel"
                ) : (
                  <>
                    <Crown size={18} />
                    {user ? "Passer à Pro" : "Commencer avec Pro"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Credits */}
            <div className="glass-card" style={{ padding: "2.5rem" }}>
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <CreditCard size={22} color="#06b6d4" />
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)" }}>À la carte</h2>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                  <span style={{ fontSize: "3rem", fontWeight: 900, color: "var(--text)" }}>2,90€</span>
                  <span style={{ color: "var(--text-muted)" }}>/ 50 crédits</span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  Pour ceux qui n&apos;aiment pas les abonnements
                </p>
              </div>
              <ul style={{ listStyle: "none", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {["50 crédits par achat", "Pas d'abonnement", "Valable 1 an", "Tous les outils inclus", "Achetez à volonté"].map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    <Check size={16} color="#06b6d4" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <button className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "0.8rem", borderColor: "rgba(6,182,212,0.3)" }}>
                  Acheter des crédits
                </button>
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "2rem",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text)", marginBottom: "1.5rem" }}>
              Questions fréquentes
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                {
                  q: "Comment fonctionne la limite gratuite ?",
                  a: "Vous avez 20 générations par mois, tous outils confondus. Le compteur se remet à zéro le 1er de chaque mois. Aucune carte bancaire requise.",
                },
                {
                  q: "Comment annuler mon abonnement Pro ?",
                  a: "En 1 clic depuis votre dashboard → 'Gérer l'abonnement'. Le portail Stripe s'ouvre et vous pouvez annuler immédiatement. Vous gardez l'accès Pro jusqu'à la fin de la période payée.",
                },
                {
                  q: "Mes documents sont-ils conservés ?",
                  a: "Non. Vos fichiers ne sont jamais stockés. L'IA traite votre texte et retourne le résultat — rien n'est gardé sur nos serveurs.",
                },
                {
                  q: "Quels modes de paiement acceptez-vous ?",
                  a: "Carte bancaire (Visa, Mastercard, Amex), Apple Pay, Google Pay — le tout sécurisé par Stripe.",
                },
              ].map(({ q, a }) => (
                <div key={q}>
                  <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.3rem", fontSize: "0.95rem" }}>
                    {q}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
