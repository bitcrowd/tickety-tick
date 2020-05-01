import { createSlug } from 'speakingurl';

export const lowercase = () => (s) => s.toLowerCase();

export const shellquote = () => (s) =>
  typeof s === 'string' ? `'${s.replace(/'/g, "'\\''")}'` : "''";

export const slugify = () => createSlug({ separator: '-' });

export const trim = () => (s) => s.trim();

export const uppercase = () => (s) => s.toUpperCase();
