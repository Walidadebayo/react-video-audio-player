"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Github } from "lucide-react";
import Image from "next/image";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Docs", href: "/docs" },
    { name: "Demo", href: "/demo" },
    { name: "Installation", href: "/installation" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="React Video Audio Player"
                width={0}
                height={0}
                className="w-10 h-10"
              />
              <span className="text-xl font-bold hidden xs:block">
                React VA Player
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="justify-end hidden md:flex md:items-center md:space-x-6">
            <Link
              href="https://npmjs.com/package/react-video-audio-player"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width={20}
                height={20}
              >
                <path d="M20.001 3C20.5533 3 21.001 3.44772 21.001 4V20C21.001 20.5523 20.5533 21 20.001 21H4.00098C3.44869 21 3.00098 20.5523 3.00098 20V4C3.00098 3.44772 3.44869 3 4.00098 3H20.001ZM19.001 5H5.00098V19H19.001V5ZM17.001 7V17H14.501V9.5H12.001V17H7.00098V7H17.001Z"></path>
              </svg>
            </Link>
            <Link
              href="https://github.com/Walidadebayo/react-video-audio-player"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1"
            >
              <Github className="h-5 w-5" />
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden">
            <Link
              href="https://npmjs.com/package/react-video-audio-player"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width={20}
                height={20}
              >
                <path d="M20.001 3C20.5533 3 21.001 3.44772 21.001 4V20C21.001 20.5523 20.5533 21 20.001 21H4.00098C3.44869 21 3.00098 20.5523 3.00098 20V4C3.00098 3.44772 3.44869 3 4.00098 3H20.001ZM19.001 5H5.00098V19H19.001V5ZM17.001 7V17H14.501V9.5H12.001V17H7.00098V7H17.001Z"></path>
              </svg>
            </Link>
            <Link
              href="https://github.com/Walidadebayo/react-video-audio-player"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1"
            >
              <Github className="h-5 w-5" />
            </Link>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="https://github.com/Walidadebayo/react-video-audio-player"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                GitHub
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
