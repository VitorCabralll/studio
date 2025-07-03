# 🎨 Design System LexAI

> **Guia de Design e Orientações de Estilo da Interface**

---

## 🎯 **Filosofia de Design**

### **Público-Alvo**
- **Operadores do Direito**: Advogados, promotores, defensores, juristas
- **Contexto de Uso**: Profissionais que leem intensamente durante o dia
- **Necessidades**: Conforto visual + impacto profissional

### **Princípios Fundamentais**
1. **Conforto Cognitivo**: Interface que não cansa os olhos
2. **Impacto Visual**: Primeira impressão profissional e elegante
3. **Hierarquia Clara**: Informações organizadas e focadas
4. **Acessibilidade**: Legível em diferentes condições

---

## 🖥️ **Sistema de Cores**

### **Paleta Principal**
```css
/* Cores Base - Conforto Visual */
--primary: 215 60% 55%;           /* Azul profissional suave */
--secondary: 215 20% 97%;         /* Cinza quente claro */
--accent: 185 40% 45%;            /* Teal calmante */

/* Gradientes Elegantes */
--gradient-hero: from-slate-50 via-blue-50/50 to-indigo-100/60;
--gradient-button: from-blue-600 via-indigo-600 to-purple-600;
--gradient-card: from-white/90 to-white/80;
```

### **Modo Escuro**
```css
/* Dark Mode - Conforto para trabalho noturno */
--background: 220 15% 8%;
--foreground: 215 20% 88%;
--primary: 215 50% 65%;           /* Azul mais suave no escuro */
```

---

## 🧱 **Componentes Base**

### **Glass Morphism**
```css
.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}
```

### **Sombras Elegantes**
```css
--shadow-subtle: 0px 1px 2px rgba(0, 0, 0, 0.02);
--shadow-medium: 0px 2px 4px rgba(0, 0, 0, 0.04);
--shadow-large: 0px 8px 16px rgba(0, 0, 0, 0.06);
```

### **Animações Profissionais**
- **Framer Motion**: Todas as animações padronizadas
- **Easings**: Smooth [0.16, 1, 0.3, 1] para transições elegantes
- **Durations**: 300ms para hover, 600ms para entrada de elementos

---

## 📝 **Tipografia Otimizada**

### **Hierarquia Visual**
```css
/* Otimizado para leitura profissional */
.text-display {
  font-size: clamp(2.5rem, 6vw, 4rem);
  line-height: 1.1;
  font-weight: 600;
}

.text-body {
  font-size: 1rem;
  line-height: 1.65;           /* Maior espaçamento para conforto */
  font-weight: 400;
}

.text-body-large {
  font-size: 1.0625rem;
  line-height: 1.7;            /* Máximo conforto para textos longos */
}
```

### **Cores de Texto**
```css
--text-headline: 215 30% 18%;    /* Títulos com contraste suave */
--text-body: 215 20% 35%;        /* Corpo com menos fadiga visual */
--text-caption: 215 15% 55%;     /* Legendas discretas */
```

---

## 🌟 **Componentes Específicos**

### **Header**
- **Background**: Glass effect com `backdrop-blur-lg`
- **Navegação**: 4 itens principais (Recursos, Preços, Segurança, Contato)
- **Theme Toggle**: Botão simples sem opção "sistema"

### **Hero Section**
- **Background**: Gradiente elegante com orbs animados
- **Cards**: Glass morphism com hover effects
- **Buttons**: Gradientes profissionais com micro-animações

### **Features Cards**
- **Hover**: Elevação sutil com `hover:-translate-y-1`
- **Icons**: Backgrounds coloridos com gradientes
- **Spacing**: Generoso para respiração visual

### **Testimonials → Benefits**
- **Foco**: Benefícios profissionais ao invés de feedback beta
- **Stats**: Números impactantes (50+ tipos, 24/7, LGPD, A+)
- **Icons**: Emojis profissionais e reconhecíveis

---

## 📱 **Responsividade**

### **Breakpoints**
```css
sm: 640px    /* Mobile landscape */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large desktop */
```

### **Layout Móvel**
- **Header**: Menu hambúrguer com overlay
- **Hero**: Cards empilhados verticalmente
- **Features**: Grid 1 coluna com espaçamento otimizado

---

## 🎛️ **Estados e Interações**

### **Focus States**
```css
.focus-ring {
  focus-visible:ring-2 
  focus-visible:ring-ring 
  focus-visible:ring-offset-1;
}
```

### **Hover Effects**
- **Buttons**: Scale 1.02 + gradiente overlay
- **Cards**: Elevação + scale 1.05
- **Icons**: Scale 1.1 + cor mais intensa

### **Loading States**
- **Skeleton**: Gradientes sutis
- **Progress**: Barras animadas com Framer Motion
- **Spinners**: Animações suaves e discretas

---

## 🧠 **Otimizações Cognitivas**

### **Redução de Fadiga Visual**
1. **Contrastes Suaves**: Evita branco puro em fundos
2. **Espaçamento Generoso**: Line-height 1.65+ para textos
3. **Hierarquia Clara**: Tamanhos e cores bem definidos
4. **Animações Sutis**: Não distraem do conteúdo

### **Foco na Informação**
- **Pontos Focais**: Gradientes direcionam olhar
- **Whitespace**: Respiração visual adequada
- **Agrupamento**: Elementos relacionados próximos

---

## 🔧 **Implementação Técnica**

### **Estrutura CSS**
```
globals.css
├── Base colors (HSL custom properties)
├── Typography classes
├── Utility classes
├── Glass effects
└── Animation keyframes (migradas para Framer Motion)
```

### **Componentes Framer Motion**
```
/components/ui/motion.tsx
├── FadeIn
├── SlideUp
├── AnimatedButton
├── StaggerContainer
└── TextAnimate
```

### **Animações Padronizadas**
```
/lib/animations.ts
├── easings
├── durations
├── variants
└── transitions
```

---

## 📊 **Métricas de Sucesso**

### **Indicadores Visuais**
- [ ] Primeira impressão profissional
- [ ] Navegação intuitiva
- [ ] Leitura confortável
- [ ] Conversão clara

### **Performance**
- [ ] Animações 60fps
- [ ] Carregamento < 3s
- [ ] Core Web Vitals otimizados
- [ ] Acessibilidade AA

---

## 🚀 **Próximos Passos**

### **Melhorias Planejadas**
1. **Micro-interações**: Feedback visual refinado
2. **Personalização**: Temas para diferentes áreas do direito
3. **Acessibilidade**: Suporte completo a leitores de tela
4. **Performance**: Otimização de gradientes e blur effects

### **Testes Necessários**
- [ ] Teste com operadores do direito
- [ ] Validação de fadiga visual
- [ ] Conversão mobile vs desktop
- [ ] Performance em dispositivos mais fracos

---

**📅 Última atualização**: Janeiro 2025  
**👥 Responsável**: Design System Team  
**🔄 Versão**: 2.0 - Cognitive Comfort + Visual Impact