"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Le mot de passe doit faire au moins 8 caractères");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erreur d'inscription");
      } else {
        toast.success("Compte créé ! Bienvenue sur Liora 🎉");
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
      className="hero-gradient"
    >
      <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "2.5rem" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={20} color="white" />
              </div>
              <span
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Liora
              </span>
            </div>
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.5rem" }}>
            Commencez gratuitement
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            5 générations offertes · Aucune carte requise
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Name */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
              Prénom & Nom
            </label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                className="input-field"
                placeholder="Marie Dupont"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
              Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="email"
                className="input-field"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
              Mot de passe
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type={showPass ? "text" : "password"}
                className="input-field"
                placeholder="8 caractères minimum"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
                style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", padding: "0.8rem", fontSize: "1rem", marginTop: "0.5rem" }}
          >
            {loading ? <span className="spinner" /> : "Créer mon compte gratuit"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.5 }}>
          En vous inscrivant, vous acceptez nos{" "}
          <Link href="#" style={{ color: "#7c3aed", textDecoration: "none" }}>CGU</Link> et notre{" "}
          <Link href="#" style={{ color: "#7c3aed", textDecoration: "none" }}>politique de confidentialité</Link>.
        </p>

        <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Déjà un compte ?{" "}
          <Link href="/login" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
