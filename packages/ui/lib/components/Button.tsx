import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../utils';

export type ButtonProps = {
  theme?: 'light' | 'dark';
} & ComponentPropsWithoutRef<'button'>;

export function Button({ theme, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'mt-4 py-2 px-6 font-bold rounded shadow hover:scale-105 transition-all',
        theme === 'light' ? 'bg-white text-black' : 'bg-black text-white',
        className,
      )}
      {...props}>
      {children}
    </button>
  );
}
