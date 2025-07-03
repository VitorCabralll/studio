"use client";

import { Scale, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Recursos", href: "#features" },
    { name: "Preços", href: "#pricing" },
    { name: "Segurança", href: "#security" },
    { name: "Contato", href: "#contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-lg shadow-lg/20 dark:border-slate-800/50 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Scale className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              LexAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 md:flex">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-caption font-medium transition-colors duration-200 hover:text-primary"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center space-x-3 md:flex">
            <ThemeToggle />
            <Button asChild variant="ghost" className="focus-ring">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 focus-ring">
              <Link href="/signup">Começar Grátis</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="size-9 focus-ring"
            >
              {isMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-body hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="mt-4 space-y-2">
                <Button asChild variant="ghost" className="w-full focus-ring">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 focus-ring">
                  <Link href="/signup">Começar Grátis</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}