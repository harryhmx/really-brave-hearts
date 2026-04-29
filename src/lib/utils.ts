import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toDbUsername(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "_")
}

export function toDisplayName(dbUsername: string): string {
  return dbUsername.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}
