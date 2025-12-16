"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Button from "./ui/button";

export default function ThemeToggleBtn() {
  const { systemTheme, theme, setTheme } = useTheme();

  if (!theme) {
    return;
  }
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <Button variant="icon" onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")} title="Toggle Theme">
      {currentTheme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
