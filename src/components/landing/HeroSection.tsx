"use client";
import Link from "next/link";
import { Sparkles, FileText, Briefcase, Pencil, ArrowRight, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="hero-gradient"
      style={{
        padding: "6rem 1.5rem 5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "5%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: "20px",
            padding: "0.4rem 1rem",
            marginBottom: "2rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#7c3aed",
          }}
        >
          <Sparkles size={14} />
          Propulsé par Groq AI
          <Star size={12} fill="#7c3aed" />
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            color: "var(--text)",
          }}
        >
          Vos documents,{" "}
          <span className="gradient-text">transformés par l&apos;IA</span>
        </h1>

        <p
          style={{
            fontSize: "1.15rem",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            maxWidth: "600px",
            margin: "0 auto 2.5rem",
          }}
        >
          Résumez vos PDFs en secondes, générez un CV professionnel et une lettre de
          motivation, ou corrigez vos textes en plusieurs langues — tout ça sans quitter
          votre navigateur.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "3rem",
          }}
        >
          <Link href="/register">
            <button
              className="btn-primary"
              style={{ fontSize: "1rem", padding: "0.8rem 2rem" }}
            >
              Commencer gratuitement
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: FileText, label: "Résumé PDF" },
            { icon: Briefcase, label: "CV & Lettre" },
            { icon: Pencil, label: "Correction texte" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--text-muted)",
              }}
            >
              <Icon size={15} style={{ color: "#7c3aed" }} />
              {label}
            </div>
          ))}
        </div>

        {/* Trust signal */}
        <p
          style={{
            marginTop: "2.5rem",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          ✓ 20 générations gratuites · ✓ Annulation en 1 clic · ✓ Données sécurisées
        </p>
      </div>
    </section>
  );
}
