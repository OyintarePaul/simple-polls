import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serializeLeanDoc<T>(doc: any) {
  return JSON.parse(JSON.stringify(doc)) as T
}