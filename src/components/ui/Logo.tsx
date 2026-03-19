import React from 'react';
import { cn } from '@/lib/design-system';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}

export function Logo({ className, iconClassName, showText = true, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 40 40" 
        fill="none" 
        className={cn("w-8 h-8 flex-shrink-0 shadow-lg shadow-primary-500/20 rounded-xl", iconClassName)}
        {...props}
      >
        <rect width="40" height="40" rx="12" fill="url(#paint0_linear)"/>
        {/* Layer Stack Icon */}
        <path 
          d="M12 25.5L20 29.5L28 25.5M12 18L20 22L28 18M20 10.5L12 14.5L20 18.5L28 14.5L20 10.5Z" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8176ff" />
            <stop offset="0.5" stopColor="#635BFF" />
            <stop offset="1" stopColor="#4338ca" />
          </linearGradient>
        </defs>
      </svg>
      
      {showText && (
        <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
          Sub<span className="text-primary-500">Flow</span>
        </span>
      )}
    </div>
  );
}
