"use client";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { Moon, Sun, Sparkles, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("À bientôt !");
    router.push("/");
  };

  return (
    <nav
      style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={18} color="white" />
          </div>
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Liora
          </span>
        </Link>

        {/* Desktop nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
          className="hidden-mobile"
        >
          <NavLinks />
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "0.4rem",
              cursor: "pointer",
              display: "flex",
              color: "var(--text-muted)",
            }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Auth buttons */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link href="/dashboard">
                <button className="btn-secondary" style={{ padding: "0.4rem 0.9rem", fontSize: "0.875rem" }}>
                  <LayoutDashboard size={15} />
                  Dashboard
                </button>
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "0.4rem",
                  borderRadius: "8px",
                  display: "flex",
                }}
                title="Déconnexion"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link href="/login">
                <button className="btn-secondary" style={{ padding: "0.4rem 0.9rem", fontSize: "0.875rem" }}>
                  Connexion
                </button>
              </Link>
              <Link href="/register">
                <button className="btn-primary" style={{ padding: "0.4rem 0.9rem", fontSize: "0.875rem" }}>
                  Essai gratuit
                </button>
              </Link>
            </div>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text)",
              display: "none",
            }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "var(--bg-card)",
            borderTop: "1px solid var(--border)",
            padding: "1rem 1.5rem",
          }}
        >
          <NavLinks mobile onClick={() => setMenuOpen(false)} />
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

function NavLinks({ mobile, onClick }: { mobile?: boolean; onClick?: () => void }) {
  const style = mobile
    ? { display: "flex", flexDirection: "column" as const, gap: "0.75rem" }
    : { display: "flex", gap: "1.5rem" };

  return (
    <div style={style}>
      {[
        { href: "/#tools", label: "Outils" },
      ].map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onClick}
          style={{
            textDecoration: "none",
            color: "var(--text-muted)",
            fontWeight: 500,
            fontSize: "0.9rem",
            transition: "color 0.2s",
          }}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}
