"use client";

import { motion } from "framer-motion";
import { useRef, forwardRef, ReactElement } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedBeamProps {
  className?: string;
  containerRef: React.RefObject<HTMLElement>;
  fromRef: React.RefObject<HTMLElement>;
  toRef: React.RefObject<HTMLElement>;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export const AnimatedBeam = forwardRef<SVGSVGElement, AnimatedBeamProps>(
  (
    {
      className,
      containerRef,
      fromRef,
      toRef,
      curvature = 0,
      reverse = false,
      duration = Math.random() * 3 + 4,
      delay = 0,
      pathColor = "gray",
      pathWidth = 2,
      pathOpacity = 0.2,
      gradientStartColor = "#18CCFC",
      gradientStopColor = "#6344F5",
      startXOffset = 0,
      startYOffset = 0,
      endXOffset = 0,
      endYOffset = 0,
    },
    ref
  ) => {
    const id = useRef(`beam-${Math.random()}`);

    return (
      <svg
        ref={ref}
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        style={{
          position: "absolute",
          pointerEvents: "none",
          top: 0,
          left: 0,
        }}
        className={cn("absolute inset-0", className)}
      >
        <defs>
          <linearGradient
            id={`${id.current}-gradient`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
            <stop offset="50%" stopColor={gradientStartColor} />
            <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 20 50 Q 50 20 80 50"
          stroke={`url(#${id.current}-gradient)`}
          strokeWidth={pathWidth}
          fill="none"
          initial={{
            pathLength: 0,
            opacity: 0,
          }}
          animate={{
            pathLength: 1,
            opacity: 1,
          }}
          transition={{
            pathLength: {
              duration,
              delay,
              ease: "easeInOut",
            },
            opacity: {
              duration: 0.5,
              delay,
            },
          }}
        />
      </svg>
    );
  }
);

AnimatedBeam.displayName = "AnimatedBeam";