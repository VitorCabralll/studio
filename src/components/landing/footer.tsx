"use client";

import { Scale, Mail, MapPin, Shield } from "lucide-react";

export function Footer() {
  const footerLinks = {
    product: [
      { name: "Recursos", href: "#features" },
      { name: "Preços", href: "#pricing" },
      { name: "Segurança", href: "/seguranca" },
      { name: "Depoimentos", href: "#testimonials" },
    ],
    access: [
      { name: "Fazer Login", href: "/login" },
      { name: "Criar Conta", href: "/signup" },
      { name: "Começar Teste", href: "/generate" },
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
                suporte@lexai.com.br
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 size-4" />
                Cuiabá - MT
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
            <h3 className="mb-4 font-semibold text-white">Acesso</h3>
            <ul className="space-y-3">
              {footerLinks.access.map((link) => (
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

          {/* Security Badges */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 font-semibold text-white">Segurança & Compliance</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-green-800/50 bg-green-950/30 p-3">
                <Shield className="size-5 text-green-400" />
                <div>
                  <div className="text-sm font-semibold text-green-300">LGPD Compliant</div>
                  <div className="text-xs text-green-400/80">Proteção total de dados</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="mb-6 rounded-lg border border-amber-800/50 bg-amber-950/30 p-4">
            <p className="text-sm text-amber-200">
              <strong>Aviso Legal:</strong> A LexAI é uma plataforma de tecnologia. Não prestamos serviços jurídicos. 
              Todo conteúdo gerado deve ser revisado por profissional habilitado. A responsabilidade pelo uso é do usuário.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-gray-400">
              © 2024 LexAI. Todos os direitos reservados.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <span className="text-sm text-gray-400">
                Desenvolvido com dedicação para todos os brasileiros
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}