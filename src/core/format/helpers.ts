import { createSlug } from "speakingurl";

type StringMappingFn = (input: string) => string;

export const lowercase = (): StringMappingFn => (s) => s.toLowerCase();

export const map = (...pairs: string[]): StringMappingFn => {
  const mappings: Record<string, string> = {};

  for (let i = 0; i < pairs.length; i += 2) {
    mappings[pairs[i]] = pairs[i + 1];
  }

  return (s) => mappings[s] ?? s;
};

map.description = 'map("from", "to"[, …])';

export const shellquote = (): StringMappingFn => (s) =>
  `'${s.replace(/'/g, "'\\''")}'`;

export const slugify = (separator = "-"): StringMappingFn =>
  createSlug({ separator });

export const substring =
  (start: number, end?: number): StringMappingFn =>
  (s) =>
    s.substring(start, end);
substring.description = "substring(start-index[, end-index])";

export const trim = (): StringMappingFn => (s) => s.trim();

export const truncate =
  (limit: number): StringMappingFn =>
  (s) =>
    s.length > limit ? `${s.substring(0, limit - 1)}…` : s;
truncate.description = "truncate(max-length)";

export const uppercase = (): StringMappingFn => (s) => s.toUpperCase();
