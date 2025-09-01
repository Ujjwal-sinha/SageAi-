"use client"

import React from 'react';

// This is a simplified mock of framer-motion for basic animations
// You can replace this with actual framer-motion if needed

interface MotionProps {
  children: React.ReactNode;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const motion = {
  div: ({ children, className, style, ...props }: MotionProps) => (
    <div className={className} style={style}>
      {children}
    </div>
  ),
  span: ({ children, className, style, ...props }: MotionProps) => (
    <span className={className} style={style}>
      {children}
    </span>
  ),
  button: ({ children, className, style, ...props }: MotionProps) => (
    <button className={className} style={style} {...props}>
      {children}
    </button>
  ),
  a: ({ children, className, style, ...props }: MotionProps) => (
    <a className={className} style={style} {...props}>
      {children}
    </a>
  ),
  ul: ({ children, className, style, ...props }: MotionProps) => (
    <ul className={className} style={style}>
      {children}
    </ul>
  ),
  li: ({ children, className, style, ...props }: MotionProps) => (
    <li className={className} style={style}>
      {children}
    </li>
  ),
  section: ({ children, className, style, ...props }: MotionProps) => (
    <section className={className} style={style}>
      {children}
    </section>
  ),
};