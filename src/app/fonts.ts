import { Poppins, PT_Sans } from 'next/font/google';

// Configuração da fonte Poppins para headings
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
});

// Configuração da fonte PT Sans para texto body
export const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap', 
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
});

// Classe CSS combinada para aplicar no body
export const fontVariables = `${poppins.variable} ${ptSans.variable}`;