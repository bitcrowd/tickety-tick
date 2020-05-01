import { createSlug } from 'speakingurl';

export const lowercase = () => (s) => s.toLowerCase();

export const shellquote = () => (s) =>
  typeof s === 'string' ? `'${s.replace(/'/g, "'\\''")}'` : "''";

export const slugify = (separator = '-') => createSlug({ separator });

export const substring = (...args) => (s) => s.substring(...args);

export const trim = () => (s) => s.trim();

export const truncate = (limit) => (s) =>
  s.length > limit ? `${s.substring(0, limit - 1)}…` : s;

export const uppercase = () => (s) => s.toUpperCase();
