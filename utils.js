import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function that merges Tailwind CSS classes and handles conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}