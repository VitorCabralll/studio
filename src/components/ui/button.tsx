/**
 * Button Component - LexAI Design System
 * 
 * Componente de botão altamente customizável com múltiplas variantes.
 * Baseado em Radix UI e class-variance-authority para máxima flexibilidade.
 * 
 * Variantes disponíveis:
 * - default: Botão primário padrão
 * - premium: Botão com gradiente e efeitos premium
 * - destructive: Para ações destrutivas
 * - outline: Botão com borda
 * - secondary: Botão secundário
 * - ghost: Botão sem fundo
 * - link: Estilo de link
 * 
 * @example
 * ```tsx
 * <Button variant="premium" size="lg">
 *   Botão Premium
 * </Button>
 * ```
 */

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

// Performance optimization: memoize variant calculation
const variantCache = new Map<string, string>();

// Optimized button variants with reduced CSS complexity
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        premium: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/25",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.memo(React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, onClick, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Optimize class name calculation with caching
    const cacheKey = `${variant}-${size}-${className}`;
    let computedClassName = variantCache.get(cacheKey);
    
    if (!computedClassName) {
      computedClassName = cn(buttonVariants({ variant, size, className }));
      variantCache.set(cacheKey, computedClassName);
    }
    
    // Optimize onClick handler to prevent unnecessary re-renders
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    }, [onClick, disabled]);
    
    return (
      <Comp
        className={computedClassName}
        onClick={handleClick}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
))
Button.displayName = "Button"

export { Button, buttonVariants }
