"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import {
  FileText,
  Briefcase,
  Pencil,
  Crown,
  Zap,
  ArrowRight,
  Settings,
  BarChart2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleManageSubscription = async () => {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Erreur");
      }
    } catch {
      toast.error("Erreur serveur");
    }
  };

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner" style={{ borderTopColor: "#7c3aed", borderColor: "rgba(124,58,237,0.2)", width: "36px", height: "36px", borderWidth: "3px" }} />
      </div>
    );
  }

  const creditsPercent = Math.min(100, (user.creditsUsed / user.creditsLimit) * 100);
  const creditsLeft = user.creditsLimit - user.creditsUsed;

  const tools = [
    {
      icon: FileText,
      color: "#7c3aed",
      bg: "rgba(124,58,237,0.1)",
      title: "Résumeur PDF",
      description: "Résumez vos PDFs et articles",
      href: "/tools/pdf-summary",
    },
    {
      icon: Briefcase,
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.1)",
      title: "Générateur CV",
      description: "CV + Lettre de motivation",
      href: "/tools/cv-generator",
    },
    {
      icon: Pencil,
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      title: "Correcteur texte",
      description: "Corriger, reformuler, formaliser",
      href: "/tools/text-corrector",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Welcome banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #4c1d95 0%, #1e3a5f 100%)",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", marginBottom: "0.25rem" }}>
              Bonjour, {user.name.split(" ")[0]} 👋
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
              {user.plan === "pro"
                ? "Vous êtes sur le plan Pro · 300 générations/mois"
                : "Plan gratuit · 5 générations/mois"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span className={user.plan === "pro" ? "badge-pro" : "badge-free"}>
              {user.plan === "pro" ? "✨ Pro" : "Gratuit"}
            </span>
            {user.plan === "free" && (
              <Link href="/pricing">
                <button
                  style={{
                    background: "white",
                    color: "#7c3aed",
                    border: "none",
                    padding: "0.5rem 1.2rem",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Crown size={14} />
                  Passer à Pro
                </button>
              </Link>
            )}
            {user.plan === "pro" && (
              <button
                onClick={handleManageSubscription}
                className="btn-secondary"
                style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
              >
                <Settings size={14} />
                Gérer l&apos;abonnement
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {/* Credits */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <BarChart2 size={16} color="#7c3aed" />
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-muted)" }}>
                Crédits ce mois
              </span>
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>
              {creditsLeft}
              <span style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 400 }}>
                {" "}/ {user.creditsLimit}
              </span>
            </div>
            <div
              style={{
                background: "var(--border)",
                borderRadius: "4px",
                height: "6px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${creditsPercent}%`,
                  height: "100%",
                  background: creditsPercent > 80 ? "#ef4444" : "linear-gradient(90deg, #7c3aed, #06b6d4)",
                  borderRadius: "4px",
                  transition: "width 0.5s",
                }}
              />
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
              {creditsLeft === 0 ? "Limite atteinte" : `${creditsLeft} générations restantes`}
            </p>
          </div>

          {/* Plan info */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {user.plan === "pro" ? <Crown size={16} color="#7c3aed" /> : <Zap size={16} color="#64748b" />}
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-muted)" }}>
                Mon plan
              </span>
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.25rem" }}>
              {user.plan === "pro" ? "Pro" : "Gratuit"}
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {user.plan === "pro"
                ? "300 génér. · Tous les outils"
                : "5 génér. · Outils basiques"}
            </p>
          </div>

          {/* Email */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-muted)" }}>
                📧 Compte
              </span>
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem", wordBreak: "break-all" }}>
              {user.email}
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {user.name}
            </p>
          </div>
        </div>

        {/* Tools */}
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: "1.25rem" }}>
          Mes outils IA
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} style={{ textDecoration: "none" }}>
              <div
                className="glass-card"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      background: tool.bg,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <tool.icon size={22} color={tool.color} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.95rem" }}>
                      {tool.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {tool.description}
                    </div>
                  </div>
                </div>
                <ArrowRight size={18} color="var(--text-muted)" />
              </div>
            </Link>
          ))}
        </div>

        {/* Upgrade CTA for free users */}
        {user.plan === "free" && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.1))",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: "16px",
              padding: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h3 style={{ fontWeight: 700, color: "var(--text)", marginBottom: "0.25rem" }}>
                🚀 Débloquez le plein potentiel de Liora
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                300 générations/mois · Tous les outils · Annulation en 1 clic à 7,90€/mois
              </p>
            </div>
            <Link href="/pricing">
              <button className="btn-primary">
                <Crown size={16} />
                Passer à Pro
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
