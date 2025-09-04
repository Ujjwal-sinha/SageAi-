import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
  {
    variants: {
      variant: {
        default: 
          'btn-web3 text-white shadow-glow-blue hover:scale-105 hover:shadow-glow-purple border border-accent/20',
        primary:
          'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 shadow-glow-blue hover:shadow-glow-purple hover:scale-105 border border-blue-500/30',
        secondary:
          'glass text-foreground hover:glass-strong hover:scale-105 border border-white/10 hover:border-white/20',
        outline:
          'border-2 border-accent/50 bg-transparent text-accent hover:bg-accent/10 hover:border-accent hover:scale-105 hover:shadow-glow-blue backdrop-blur-sm',
        ghost: 
          'text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:scale-105 rounded-lg',
        destructive:
          'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105',
        success:
          'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105',
        link: 
          'text-accent underline-offset-4 hover:underline hover:text-accent/80',
        gradient: 
          'gradient-shift text-white hover:scale-105 shadow-glow-blue hover:shadow-glow-purple border border-accent/20',
        neon:
          'bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:shadow-glow-cyan hover:scale-105 font-mono uppercase tracking-wider',
      },
      size: {
        default: 'h-11 px-6 py-2.5 text-sm',
        sm: 'h-9 px-4 py-2 text-xs',
        lg: 'h-14 px-8 py-3 text-base',
        xl: 'h-16 px-10 py-4 text-lg',
        icon: 'h-11 w-11 p-0',
        'icon-sm': 'h-9 w-9 p-0',
        'icon-lg': 'h-14 w-14 p-0',
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
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 w-0 group-hover:w-full transition-all duration-500 ease-out opacity-0 group-hover:opacity-100" />
        
        <div className="relative flex items-center gap-2">
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
