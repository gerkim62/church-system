import {  clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type {ClassValue} from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function generateSlug(name: string) {
  const OUR_EPOCH = 1762605336987; //to make slugs shorter
  // Generate slug from title
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    (Date.now() - OUR_EPOCH).toString(36);
  return slug;
}