import { createSlug } from "speakingurl";

type StringMappingFn = (input: string) => string;

export const lowercase = (): StringMappingFn => (s) => s.toLowerCase();

// This is a mapping function, it can be used in two ways:
// 1. With an object: map({ a: "b" }) will return a function that maps "a" to "b" and returns the original value for any other input.
// 2. With pairs of arguments: map("a", "b", "c", "d") will return a function that maps "a" to "b", "c" to "d", and returns the original value for any other input.
export const map = (
  objectOrString: Record<string, string> | string,
  ...otherArgs: string[]
): StringMappingFn => {
  // If the first argument is an object, use it directly.
  if (typeof objectOrString !== "string") {
    return (s) => objectOrString[s] || s;
  }

  // Otherwise, build a mapping object from pairs of arguments once.
  const mapping: Record<string, string> = {};
  const pairs = [objectOrString, ...otherArgs];
  for (let i = 0; i < pairs.length; i += 2) {
    const value = pairs[i + 1];
    if (value !== undefined) {
      mapping[pairs[i]] = value;
    }
  }

  return (s) => mapping[s] ?? s;
};

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
