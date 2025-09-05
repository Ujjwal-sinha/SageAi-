import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
  {
    variants: {
      variant: {
        default: 
          'btn-holographic text-white hover-lift border border-cyan-500/20 hover:neon-glow-cyan',
        primary:
          'bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-700 text-white hover:from-cyan-700 hover:via-purple-700 hover:to-blue-800 neon-glow-cyan hover:neon-glow-purple hover-lift border border-cyan-500/30',
        secondary:
          'glass-card text-white hover:glass-strong hover-lift border border-white/20 hover:border-cyan-500/30 hover:neon-glow-cyan',
        outline:
          'btn-cyber bg-transparent text-cyan-400 hover:text-white hover-lift backdrop-blur-sm',
        ghost: 
          'text-gray-300 hover:text-white hover:glass hover-lift rounded-lg',
        destructive:
          'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 neon-glow-pink hover-lift',
        success:
          'bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-700 hover:to-emerald-800 neon-glow-cyan hover-lift',
        link: 
          'text-cyan-400 underline-offset-4 hover:underline hover:text-cyan-300',
        gradient: 
          'cyber-gradient text-white hover-lift neon-glow-cyan hover:neon-glow-purple border border-cyan-500/20',
        neon:
          'bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:neon-glow-cyan hover-lift font-cyber uppercase tracking-wider',
        holographic:
          'btn-holographic text-white hover-lift border border-white/20 hover:border-cyan-500/30',
      },
      size: {
        default: 'h-12 px-6 py-3 text-sm',
        sm: 'h-10 px-4 py-2 text-xs',
        lg: 'h-16 px-8 py-4 text-base',
        xl: 'h-20 px-12 py-5 text-lg',
        icon: 'h-12 w-12 p-0',
        'icon-sm': 'h-10 w-10 p-0',
        'icon-lg': 'h-16 w-16 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, leftIcon, rightIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {/* Enhanced shimmer effect */}
        <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 w-0 group-hover:w-full transition-all duration-700 ease-out opacity-0 group-hover:opacity-100" />
        
        {/* Holographic overlay */}
        <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
        
        <div className="relative flex items-center gap-2 z-10">
          {loading ? (
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : leftIcon ? (
            leftIcon
          ) : null}
          
          {children}
          
          {!loading && rightIcon && rightIcon}
        </div>
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };