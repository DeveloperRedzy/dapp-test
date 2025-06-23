import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format SUI amount for display
 * Converts from smallest unit (MIST) to SUI if needed
 */
export function formatSUI(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0.000';
  
  // If the number is very large, it's likely in MIST, convert to SUI
  if (num > 1000000) {
    return (num / 1000000000).toFixed(3);
  }
  
  return num.toFixed(3);
}
