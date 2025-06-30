"use client";

import { Scale, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const footerLinks = {
    product: [
      { name: "Funcionalidades", href: "#features" },
      { name: "Preços", href: "#pricing" },
      { name: "Demo", href: "#demo" },
      { name: "API", href: "/api-docs" },
    ],
    legal: [
      { name: "Privacidade", href: "/privacy" },
      { name: "Termos de Uso", href: "/terms" },
      { name: "LGPD", href: "/lgpd" },
      { name: "Compliance", href: "/compliance" },
    ],
    support: [
      { name: "Central de Ajuda", href: "/help" },
      { name: "Contato", href: "/contact" },
      { name: "Status", href: "/status" },
      { name: "Comunidade", href: "/community" },
    ],
    company: [
      { name: "Sobre", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Carreiras", href: "/careers" },
      { name: "Imprensa", href: "/press" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Logo e descrição */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Scale className="size-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
                LexAI
              </span>
            </div>
            <p className="mb-6 leading-relaxed text-gray-400">
              Plataforma de IA especializada em documentos jurídicos brasileiros. 
              Automatize sua prática e foque no que realmente importa.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <Mail className="mr-2 size-4" />
                contato@lexai.com.br
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 size-4" />
                (11) 9999-9999
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 size-4" />
                São Paulo, SP
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Produto</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Suporte</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-gray-400">
              © 2024 LexAI. Todos os direitos reservados.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <a href="/terms" className="text-sm text-gray-400 transition-colors hover:text-white">
                Termos
              </a>
              <a href="/privacy" className="text-sm text-gray-400 transition-colors hover:text-white">
                Privacidade
              </a>
              <a href="/cookies" className="text-sm text-gray-400 transition-colors hover:text-white">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}