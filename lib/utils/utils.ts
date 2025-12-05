import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosError } from "axios";



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
