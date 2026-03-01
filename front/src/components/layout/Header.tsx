import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./Header.css";

export default function Header() {
  const location = useLocation();
  const [theme, setTheme] = useState<string | null>(null);

  // On verifie si un theme est sauvegardé
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
      setTheme(saved);
    }
  }, []);

  // Changer de theme
  const toggleTheme = () => {
    const root = document.documentElement;
  
    // Active la classe temporaire
    root.classList.add("theme-transition");
  
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
  
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  
    // Retire la classe après la transition
    // !!! bien changer aussi le temps de transition dans le 
    // base.css si changement ici
    setTimeout(() => {root.classList.remove("theme-transition");}, 2000);
  };
  

  // On active la page ou on est
  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  return (
    <header className="app-header">
        <div className="header-inner">

            <div></div>

            <nav className="nav-links">
            <Link to="/" className={isActive("/") ? "active" : ""}>
                Gallerie d'images
            </Link>
            <Link to="/tierlists" className={isActive("/tierlists") ? "active" : ""}>
                TierLists
            </Link>
            <Link to="/create" className={isActive("/create") ? "active" : ""}>
                Créer une TierList
            </Link>
            </nav>

            <div className="theme-wrapper">
              <button className="btn btn--danger" onClick={toggleTheme}>
                  {theme === "dark" ? "Clair" : "Sombre"}
              </button>
            </div>

        </div>
    </header>
  );
}
