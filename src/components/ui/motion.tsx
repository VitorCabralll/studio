/**
 * Motion Components Library - LexAI Design System
 * 
 * Biblioteca unificada de componentes de animação usando Framer Motion.
 * Todos os componentes são otimizados para performance e incluem suporte a:
 * - Intersection Observer para animações on-scroll
 * - Prefers-reduced-motion para acessibilidade
 * - Configurações de delay e duration personalizáveis
 * - Variants padronizados do design system
 * 
 * @example
 * ```tsx
 * <FadeIn delay={0.2} duration={0.6}>
 *   <h1>Título animado</h1>
 * </FadeIn>
 * ```
 */

"use client";

import { motion, HTMLMotionProps, Variants, Transition } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { 
  animationPresets, 
  createDelayedTransition, 
  createStaggerTransition,
  textWordVariants,
  textCharVariants,
  transitions 
} from "@/lib/animations";

/**
 * Props base para todos os componentes de animação
 */
interface MotionComponentProps extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate" | "transition"> {
  /** Atraso antes da animação começar (em segundos) */
  delay?: number;
  /** Duração da animação (em segundos) */
  duration?: number;
  /** Classes CSS adicionais */
  className?: string;
  /** Conteúdo do componente */
  children: React.ReactNode;
  /** Se a animação deve acontecer apenas uma vez */
  triggerOnce?: boolean;
  /** Porcentagem do elemento visível para disparar animação (0.0 - 1.0) */
  threshold?: number;
}

/**
 * Componente base interno para animações com Intersection Observer
 * 
 * @internal - Não usar diretamente, usar os componentes específicos
 */
function AnimatedComponent({
  children,
  className,
  delay = 0,
  duration,
  triggerOnce = true,
  threshold = 0.1,
  variants,
  initial,
  animate,
  transition,
  ...props
}: MotionComponentProps & {
  variants: Variants;
  initial: string;
  animate: string;
  transition: Transition;
}) {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
  });

  const customTransition = duration 
    ? { ...transition, duration } 
    : delay 
      ? createDelayedTransition(delay, transition)
      : transition;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={variants}
      initial={initial}
      animate={inView ? animate : initial}
      transition={customTransition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Componente de animação FadeIn
 * 
 * Anima a opacidade de 0 para 1 quando o elemento entra na viewport.
 * Otimizado para textos e elementos que devem aparecer suavemente.
 * 
 * @param children - Conteúdo a ser animado
 * @param className - Classes CSS adicionais
 * @param delay - Atraso em segundos (padrão: 0)
 * @param duration - Duração em segundos (padrão: do design system)
 * @param triggerOnce - Se anima apenas uma vez (padrão: true)
 * @param threshold - Threshold do Intersection Observer (padrão: 0.1)
 * 
 * @example
 * ```tsx
 * <FadeIn delay={0.3}>
 *   <p>Este texto aparece suavemente</p>
 * </FadeIn>
 * ```
 */
export function FadeIn({ children, className, delay, duration, triggerOnce = true, threshold = 0.1, ...props }: MotionComponentProps) {
  return (
    <AnimatedComponent
      className={className}
      delay={delay}
      duration={duration}
      triggerOnce={triggerOnce}
      threshold={threshold}
      variants={animationPresets.fadeIn.variants}
      initial={animationPresets.fadeIn.initial}
      animate={animationPresets.fadeIn.animate}
      transition={animationPresets.fadeIn.transition}
      {...props}
    >
      {children}
    </AnimatedComponent>
  );
}

/**
 * Componente de animação SlideUp
 * 
 * Anima o elemento deslizando de baixo para cima com fade-in.
 * Ideal para cards, seções e elementos que devem "emergir" da tela.
 * 
 * @param children - Conteúdo a ser animado
 * @param className - Classes CSS adicionais
 * @param delay - Atraso em segundos (padrão: 0)
 * @param duration - Duração em segundos (padrão: do design system)
 * @param triggerOnce - Se anima apenas uma vez (padrão: true)
 * @param threshold - Threshold do Intersection Observer (padrão: 0.1)
 * 
 * @example
 * ```tsx
 * <SlideUp delay={0.2}>
 *   <div className="card">Card animado</div>
 * </SlideUp>
 * ```
 */
export function SlideUp({ children, className, delay, duration, triggerOnce = true, threshold = 0.1, ...props }: MotionComponentProps) {
  return (
    <AnimatedComponent
      className={className}
      delay={delay}
      duration={duration}
      triggerOnce={triggerOnce}
      threshold={threshold}
      variants={animationPresets.slideUp.variants}
      initial={animationPresets.slideUp.initial}
      animate={animationPresets.slideUp.animate}
      transition={animationPresets.slideUp.transition}
      {...props}
    >
      {children}
    </AnimatedComponent>
  );
}

/**
 * Componente de animação ScaleIn
 * 
 * Anima o elemento com efeito de "zoom in" - escala de pequeno para tamanho normal.
 * Perfeito para ícones, botões e elementos que devem chamar atenção.
 * 
 * @param children - Conteúdo a ser animado
 * @param className - Classes CSS adicionais
 * @param delay - Atraso em segundos (padrão: 0)
 * @param duration - Duração em segundos (padrão: do design system)
 * @param triggerOnce - Se anima apenas uma vez (padrão: true)
 * @param threshold - Threshold do Intersection Observer (padrão: 0.1)
 * 
 * @example
 * ```tsx
 * <ScaleIn delay={0.1}>
 *   <Button>Botão que "aparece"</Button>
 * </ScaleIn>
 * ```
 */
export function ScaleIn({ children, className, delay, duration, triggerOnce = true, threshold = 0.1, ...props }: MotionComponentProps) {
  return (
    <AnimatedComponent
      className={className}
      delay={delay}
      duration={duration}
      triggerOnce={triggerOnce}
      threshold={threshold}
      variants={animationPresets.scaleIn.variants}
      initial={animationPresets.scaleIn.initial}
      animate={animationPresets.scaleIn.animate}
      transition={animationPresets.scaleIn.transition}
      {...props}
    >
      {children}
    </AnimatedComponent>
  );
}

/**
 * Card animado com efeitos premium
 * 
 * Card com animações de entrada e hover interactions sofisticadas.
 * Inclui diferentes variantes: default, premium (glass morphism), elevated.
 * 
 * @param children - Conteúdo do card
 * @param className - Classes CSS adicionais
 * @param delay - Atraso em segundos (padrão: 0)
 * @param duration - Duração em segundos (padrão: do design system)
 * @param triggerOnce - Se anima apenas uma vez (padrão: true)
 * @param threshold - Threshold do Intersection Observer (padrão: 0.1)
 * @param variant - Estilo do card: "default" | "premium" | "elevated"
 * 
 * @example
 * ```tsx
 * <AnimatedCard variant="premium" delay={0.3}>
 *   <h3>Card Premium</h3>
 *   <p>Com efeito glass morphism</p>
 * </AnimatedCard>
 * ```
 */
export function AnimatedCard({ children, className, delay, duration, triggerOnce = true, threshold = 0.1, ...props }: MotionComponentProps & { variant?: "default" | "premium" | "elevated" }) {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
  });

  const customTransition = duration 
    ? { ...animationPresets.card.transition, duration } 
    : delay 
      ? createDelayedTransition(delay, animationPresets.card.transition)
      : animationPresets.card.transition;

  const variant = (props as any).variant || "default";

  return (
    <motion.div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
        variant === "premium" && "border-gradient-to-r from-primary/20 to-accent/20 bg-gradient-to-br from-white/90 to-white/80 shadow-apple-md backdrop-blur-sm",
        variant === "elevated" && "shadow-apple-lg",
        className
      )}
      variants={animationPresets.card.variants}
      initial={animationPresets.card.initial}
      animate={inView ? animationPresets.card.animate : animationPresets.card.initial}
      whileHover={variant === "premium" || variant === "elevated" 
        ? { scale: 1.02, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } }
        : { scale: 1.01, transition: { duration: 0.2 } }
      }
      whileTap={{ scale: 0.99 }}
      transition={customTransition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Componente para botões com animações premium
export const AnimatedButton = forwardRef<HTMLButtonElement, ButtonProps & { disabled?: boolean; variant?: string }>(
  ({ children, className, disabled, variant, ...props }, ref) => {
    return (
      <motion.div
        variants={animationPresets.button.variants}
        initial={animationPresets.button.initial}
        whileHover={!disabled ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
        whileTap={!disabled ? { scale: 0.98, transition: { duration: 0.1 } } : undefined}
        animate={disabled ? "loading" : "idle"}
        transition={animationPresets.button.transition}
      >
        <Button
          ref={ref}
          className={cn(
            variant === "premium" && "[&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:translate-x-0.5",
            className
          )}
          variant={variant as any}
          disabled={disabled}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

// Componente para listas com stagger
export function StaggerContainer({ 
  children, 
  className, 
  staggerDelay = 0.1, 
  childrenDelay = 0.2,
  triggerOnce = true,
  threshold = 0.1,
  ...props 
}: MotionComponentProps & { staggerDelay?: number; childrenDelay?: number }) {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
  });

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={animationPresets.staggerContainer.variants}
      initial={animationPresets.staggerContainer.initial}
      animate={inView ? animationPresets.staggerContainer.animate : animationPresets.staggerContainer.initial}
      transition={createStaggerTransition(staggerDelay, childrenDelay)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Componente para itens de lista
export function StaggerItem({ children, className, ...props }: MotionComponentProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={animationPresets.listItem.variants}
      transition={animationPresets.listItem.transition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Componente para texto palavra por palavra
interface TextAnimateProps extends Omit<MotionComponentProps, "children"> {
  children: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
}

export function TextAnimate({ 
  children, 
  className, 
  delay = 0, 
  duration,
  staggerDelay = 0.1,
  triggerOnce = true,
  threshold = 0.1,
  ...props 
}: TextAnimateProps) {
  const words = children.split(" ");
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
  });

  const customTransition = duration 
    ? { ...transitions.text, duration } 
    : transitions.text;

  return (
    <motion.div 
      ref={ref}
      className={cn("flex flex-wrap", className)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{
        ...customTransition,
        delayChildren: delay,
        staggerChildren: staggerDelay,
      }}
      {...props}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="mr-1"
          variants={textWordVariants}
          transition={customTransition}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Componente para texto caractere por caractere
export function TextAnimateByCharacter({ 
  children, 
  className, 
  delay = 0, 
  duration,
  staggerDelay = 0.02,
  triggerOnce = true,
  threshold = 0.1,
  ...props 
}: TextAnimateProps) {
  const characters = children.split("");
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
  });

  const customTransition = duration 
    ? { ...transitions.text, duration } 
    : transitions.text;

  return (
    <motion.div 
      ref={ref}
      className={cn("inline-block", className)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{
        ...customTransition,
        delayChildren: delay,
        staggerChildren: staggerDelay,
      }}
      {...props}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className={char === " " ? "mr-1" : ""}
          variants={textCharVariants}
          transition={customTransition}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Componente para animação de blob
export function BlobAnimation({ className, delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      className={cn(className)}
      variants={animationPresets.blob.variants}
      animate={animationPresets.blob.animate}
      style={{
        animationDelay: delay ? `${delay}s` : undefined,
      }}
      {...props}
    />
  );
}

// Export do motion básico para casos customizados
export { motion } from "framer-motion";