"use client";

import { motion } from "framer-motion";
import { Scale, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Funcionalidades", href: "#features" },
    { name: "Como Funciona", href: "#how-it-works" },
    { name: "Preços", href: "#pricing" },
    { name: "Contato", href: "#contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <Scale className="size-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              LexAI
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden items-center space-x-4 md:flex">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700" asChild>
              <Link href="/signup">Começar Grátis</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 py-4 dark:border-gray-800 md:hidden"
          >
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-2 py-1 font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 border-t border-gray-200 pt-4 dark:border-gray-800">
                <Button variant="ghost" size="sm" className="justify-start" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" className="justify-start bg-blue-600 text-white hover:bg-blue-700" asChild>
                  <Link href="/signup">Começar Grátis</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}