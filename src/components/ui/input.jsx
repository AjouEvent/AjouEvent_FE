import * as React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-xl border-0 bg-[#F2F4F6] px-4 py-3 text-sm text-[#191F28] font-medium ring-offset-background placeholder:text-[#B0B8C1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium transition-all',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
