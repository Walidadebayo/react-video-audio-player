"use client";
import useMounted from "@/hooks/useMounted";
import { ThemeProvider as NextThemesProvider, ThemeProviderProps, useTheme} from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    mounted && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    )
  );
};