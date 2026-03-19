import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with conflict resolution
 * Automatically resolves conflicts (e.g., p-4 vs p-6 → keeps last)
 *
 * @param inputs - Array of class names
 * @returns Merged class string
 *
 * @example
 * cn('px-4 py-2', 'px-6') // → 'px-6 py-2'
 * cn('bg-red-500', 'bg-blue-500 hover:bg-blue-600') // → 'bg-blue-500 hover:bg-blue-600'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
