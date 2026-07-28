"use client";
import Link from "next/link";
import { Crown, Zap } from "lucide-react";

interface Props {
  user: {
    plan: "free" | "pro";
    creditsUsed: number;
    creditsLimit: number;
  };
}

export default function CreditBar({ user }: Props) {
  const left = user.creditsLimit - user.creditsUsed;
  const percent = Math.min(100, (user.creditsUsed / user.creditsLimit) * 100);
  const isWarning = percent > 70;
  const isDanger = percent >= 100;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "0.9rem 1.25rem",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      {user.plan === "pro" ? <Crown size={16} color="#7c3aed" /> : <Zap size={16} color="#64748b" />}

      <div style={{ flex: 1, minWidth: "150px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>
            Crédits ce mois
          </span>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: isDanger ? "#ef4444" : isWarning ? "#f59e0b" : "var(--text)",
            }}
          >
            {user.creditsUsed} / {user.creditsLimit}
          </span>
        </div>
        <div style={{ background: "var(--border)", borderRadius: "4px", height: "5px", overflow: "hidden" }}>
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              background: isDanger
                ? "#ef4444"
                : isWarning
                ? "#f59e0b"
                : "linear-gradient(90deg, #7c3aed, #06b6d4)",
              borderRadius: "4px",
              transition: "width 0.5s",
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: "0.8rem", color: isDanger ? "#ef4444" : "var(--text-muted)", fontWeight: isDanger ? 600 : 400 }}>
        {isDanger ? "Limite atteinte" : `${left} restant${left > 1 ? "s" : ""}`}
      </div>

      {user.plan === "free" && (
        <Link href="/pricing">
          <button
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              color: "white",
              border: "none",
              padding: "0.35rem 0.8rem",
              borderRadius: "7px",
              fontWeight: 600,
              fontSize: "0.78rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <Crown size={12} />
            Pro
          </button>
        </Link>
      )}
    </div>
  );
}
