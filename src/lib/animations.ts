/**
 * Biblioteca de animações padronizadas com Framer Motion
 * Substitui animações CSS customizadas por soluções consistentes
 */

import { Variants, Transition } from "framer-motion";

// Configurações de easing padronizadas
export const easings = {
  smooth: [0.16, 1, 0.3, 1], // cubic-bezier(0.16, 1, 0.3, 1)
  swift: [0.4, 0, 0.2, 1],   // cubic-bezier(0.4, 0, 0.2, 1)
  snappy: [0.25, 0.46, 0.45, 0.94], // cubic-bezier(0.25, 0.46, 0.45, 0.94)
  bounce: [0.68, -0.55, 0.265, 1.55], // cubic-bezier(0.68, -0.55, 0.265, 1.55)
} as const;

// Durações padronizadas
export const durations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.6,
  slower: 0.8,
} as const;

// Variantes de animação básicas
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export const scaleOutVariants: Variants = {
  hidden: { opacity: 1, scale: 1 },
  visible: { opacity: 0, scale: 0.8 },
};

// Variantes mais complexas
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: { y: -4, scale: 1.02 },
  tap: { scale: 0.98 },
};

export const buttonVariants: Variants = {
  idle: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  loading: { scale: 0.95, opacity: 0.8 },
};

export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

// Variantes para texto palavra por palavra
export const textWordVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Variantes para texto caractere por caractere
export const textCharVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// Animações de blob (mantidas do CSS)
export const blobVariants: Variants = {
  animate: {
    x: [0, 30, -20, 0],
    y: [0, -50, 20, 0],
    scale: [1, 1.1, 0.9, 1],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Transições padronizadas
export const transitions = {
  smooth: {
    duration: durations.normal,
    ease: easings.smooth,
  } as Transition,
  
  fast: {
    duration: durations.fast,
    ease: easings.swift,
  } as Transition,
  
  slow: {
    duration: durations.slow,
    ease: easings.smooth,
  } as Transition,
  
  bounce: {
    duration: durations.normal,
    ease: easings.bounce,
  } as Transition,
  
  // Transições específicas
  card: {
    duration: durations.normal,
    ease: easings.smooth,
  } as Transition,
  
  button: {
    duration: durations.fast,
    ease: easings.swift,
  } as Transition,
  
  text: {
    duration: durations.slow,
    ease: easings.smooth,
  } as Transition,
  
  stagger: {
    duration: durations.normal,
    ease: easings.smooth,
    staggerChildren: 0.1,
  } as Transition,
};

// Container variants para animações stagger
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Presets completos para uso direto
export const animationPresets = {
  // Fade in básico
  fadeIn: {
    variants: fadeInVariants,
    initial: "hidden",
    animate: "visible",
    transition: transitions.smooth,
  },
  
  // Slide up com fade
  slideUp: {
    variants: slideUpVariants,
    initial: "hidden",
    animate: "visible",
    transition: transitions.smooth,
  },
  
  // Scale in com bounce
  scaleIn: {
    variants: scaleInVariants,
    initial: "hidden",
    animate: "visible",
    transition: transitions.bounce,
  },
  
  // Card hover effects
  card: {
    variants: cardVariants,
    initial: "hidden",
    animate: "visible",
    whileHover: "hover",
    whileTap: "tap",
    transition: transitions.card,
  },
  
  // Button interactions
  button: {
    variants: buttonVariants,
    initial: "idle",
    whileHover: "hover",
    whileTap: "tap",
    transition: transitions.button,
  },
  
  // List item com slide
  listItem: {
    variants: listItemVariants,
    initial: "hidden",
    animate: "visible",
    exit: "exit",
    transition: transitions.smooth,
  },
  
  // Stagger container
  staggerContainer: {
    variants: staggerContainerVariants,
    initial: "hidden",
    animate: "visible",
    transition: transitions.stagger,
  },
  
  // Blob animation
  blob: {
    variants: blobVariants,
    animate: "animate",
  },
};

// Utilitários para delays
export const createDelayedTransition = (delay: number, baseTransition: Transition = transitions.smooth): Transition => ({
  ...baseTransition,
  delay,
});

export const createStaggerTransition = (staggerDelay: number = 0.1, childrenDelay: number = 0.2): Transition => ({
  ...transitions.stagger,
  staggerChildren: staggerDelay,
  delayChildren: childrenDelay,
});

// Função helper para criar animações personalizadas
export const createCustomAnimation = (
  hidden: Record<string, number | string>,
  visible: Record<string, number | string>,
  transition: Transition = transitions.smooth
) => ({
  variants: { hidden, visible },
  initial: "hidden",
  animate: "visible",
  transition,
});