import * as React from "react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  // Inicjalizacja stanu po zamontowaniu komponentu
  useEffect(() => {
    // Sprawdź bieżący motyw
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);
  
  const toggleTheme = () => {
    // Zmiana stanu lokalnego
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Aktualizacja klasy dokumentu
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    
    // Zapisanie preferencji
    localStorage.setItem("theme", newTheme);
  };
  
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors ${className}`}
      aria-label={theme === "dark" ? "Przełącz na tryb jasny" : "Przełącz na tryb ciemny"}
    >
      <span className="theme-toggle-icon inline-block w-5 h-5"></span>
    </button>
  );
};

export default ThemeToggle; 