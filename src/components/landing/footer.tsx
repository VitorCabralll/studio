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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo e descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LexAI
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Plataforma de IA especializada em documentos jurídicos brasileiros. 
              Automatize sua prática e foque no que realmente importa.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                contato@lexai.com.br
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                (11) 9999-9999
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                São Paulo, SP
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produto</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 LexAI. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Termos
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacidade
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}