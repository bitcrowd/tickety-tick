import { createSlug } from "speakingurl";

export const shellquote = (value: string): string =>
  `'${value.replace(/'/g, "'\\''")}'`;

export const slugify = (value: string, separator = "-"): string =>
  createSlug({ separator })(value);
slugify.description = 'slugify: separator = "-"';

export const substring = (value: string, start: number, end?: number): string =>
  value.substring(start, end);
substring.description = "substring: start-index[, end-index]";
