/**
 * Componentes wrapper para animações Framer Motion padronizadas
 * Substitui classes CSS customizadas por componentes reutilizáveis
 */

"use client";

import { motion, HTMLMotionProps } from "framer-motion";
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

// Tipos base
interface MotionComponentProps extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate" | "transition"> {
  delay?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
  triggerOnce?: boolean;
  threshold?: number;
}

// Componente base para animações com InView
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
  variants: Record<string, any>;
  initial: string;
  animate: string;
  transition: Record<string, any>;
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

// Componentes específicos
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

// Componente para cards com hover
export function AnimatedCard({ children, className, delay, duration, triggerOnce = true, threshold = 0.1, ...props }: MotionComponentProps) {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
  });

  const customTransition = duration 
    ? { ...animationPresets.card.transition, duration } 
    : delay 
      ? createDelayedTransition(delay, animationPresets.card.transition)
      : animationPresets.card.transition;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={animationPresets.card.variants}
      initial={animationPresets.card.initial}
      animate={inView ? animationPresets.card.animate : animationPresets.card.initial}
      whileHover={animationPresets.card.whileHover}
      whileTap={animationPresets.card.whileTap}
      transition={customTransition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Componente para botões com animações
export const AnimatedButton = forwardRef<HTMLButtonElement, ButtonProps & { disabled?: boolean }>(
  ({ children, className, disabled, ...props }, ref) => {
    return (
      <motion.div
        variants={animationPresets.button.variants}
        initial={animationPresets.button.initial}
        whileHover={!disabled ? animationPresets.button.whileHover : undefined}
        whileTap={!disabled ? animationPresets.button.whileTap : undefined}
        animate={disabled ? "loading" : "idle"}
        transition={animationPresets.button.transition}
      >
        <Button
          ref={ref}
          className={cn(className)}
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