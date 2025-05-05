import * as React from "react";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  
  // Inicjalizacja stanu po zamontowaniu komponentu
  useEffect(() => {
    // Sprawdź bieżący motyw
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "dark";
    const currentTheme = savedTheme || systemTheme;
    
    setTheme(currentTheme);
    document.documentElement.classList.toggle("dark", currentTheme === "dark");
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
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle; 