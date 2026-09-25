import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  if (!token) return null;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-linear-to-br from-brand/80 to-sky-400/80 text-xs font-semibold uppercase text-white">
                {user.email[0]}
              </span>
              <span className="hidden text-sm text-ink-muted sm:inline">{user.email}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="grid size-9 place-items-center rounded-lg text-ink-muted transition hover:bg-white/5 hover:text-ink cursor-pointer"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </nav>
    </header>
  );
}
