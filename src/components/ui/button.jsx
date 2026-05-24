import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#3182F6] text-white hover:bg-[#1B6EE8] active:bg-[#1760D1]',
        destructive: 'bg-[#F04452] text-white hover:bg-[#D93746]',
        outline: 'border border-[#E5E8EB] bg-white text-[#333D4B] hover:bg-[#F9FAFB]',
        secondary: 'bg-[#EBF4FE] text-[#3182F6] hover:bg-[#D6ECFE]',
        ghost: 'text-[#6B7684] hover:bg-[#F2F4F6] hover:text-[#333D4B]',
        link: 'text-[#3182F6] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-5 py-3',
        sm: 'h-9 rounded-xl px-4 text-xs',
        lg: 'h-14 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
