"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextAnimateProps {
  children: string;
  className?: string;
  animation?: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight";
  delay?: number;
  duration?: number;
}

const animations: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
};

export function TextAnimate({
  children,
  className,
  animation = "fadeIn",
  delay = 0,
  duration = 0.6,
}: TextAnimateProps) {
  const words = children.split(" ");

  return (
    <motion.div className={cn("flex flex-wrap", className)}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="mr-1"
          variants={animations[animation]}
          initial="hidden"
          animate="visible"
          transition={{
            duration,
            delay: delay + index * 0.1,
            ease: "easeOut",
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function TextAnimateByCharacter({
  children,
  className,
  animation = "fadeIn",
  delay = 0,
  duration = 0.03,
}: TextAnimateProps) {
  const characters = children.split("");

  return (
    <motion.div className={cn("inline-block", className)}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className={char === " " ? "mr-1" : ""}
          variants={animations[animation]}
          initial="hidden"
          animate="visible"
          transition={{
            duration,
            delay: delay + index * 0.02,
            ease: "easeOut",
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}