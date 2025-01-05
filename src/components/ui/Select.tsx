import React from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = ({ className, children, ...props }: SelectProps) => {
  return (
    <select
      className={cn(
        'block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};