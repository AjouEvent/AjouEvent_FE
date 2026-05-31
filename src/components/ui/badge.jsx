import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#3182F6] text-white',
        secondary: 'bg-[#EBF4FE] text-[#3182F6]',
        destructive: 'bg-[#F04452] text-white',
        outline: 'border border-[#E5E8EB] text-[#6B7684]',
        subtle: 'bg-[#F2F4F6] text-[#6B7684] font-bold',
      },
    },
    defaultVariants: {
      variant: 'subtle',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
