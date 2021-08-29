type Binding = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
type Helpers = Record<string, (...a: any[]) => any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const trim = (s: string): string => s.trim();

/* eslint-disable @typescript-eslint/no-explicit-any */
function safe(fn: (...a: any[]) => any) {
  return function wrapped(...args: any[]) {
    try {
      return fn(...args);
    } catch (err) {
      return `!!(${(err as Error).message})`;
    }
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function raise(message: string) {
  return function raises() {
    throw new Error(message);
  };
}

// Turn an expression into a pipeline function.
//
// Example expressions:
//
//   'lowercase'
//   'lowercase()'
//   'substring(3)'
//   'substring(0, 10)'
//
function make(expr: string, transforms: Helpers = {}) {
  const [, name, , argstr = ""] = expr.match(/^([^()]+)(\((.+)\))?$/) ?? [];

  const fn = transforms[name];

  if (typeof fn !== "function") return raise(`no helper named "${name}"`);

  try {
    const args = JSON.parse(`[${argstr}]`);
    return fn(...args);
  } catch (_) {
    return raise(`invalid parameters provided to "${name}": ${argstr}`);
  }
}

// Compile a template string into a render function.
//
// Example strings:
//
//   'a = {v}'
//   'b = {v | lowercase}'
//   'c = {v | lowercase | substring(0, 3)}'
//
function compile(template: string, transforms = {}): (v?: Binding) => string {
  const parts = template.match(/\{[^}]*\}|[^{]+/g);

  if (parts === null) return () => template;

  const fns = parts.map((part) => {
    if (part[0] === "{" && part[part.length - 1] === "}") {
      const [key, ...procs] = part
        .replace(/^\{|\}$/g, "")
        .split("|")
        .map(trim);

      const pipeline = procs.map((expr) => safe(make(expr, transforms)));

      return (values: Binding) =>
        pipeline.reduce((v, fn) => fn(v), values[key] ?? "");
    }

    return () => part;
  });

  return (values = {}) => fns.map((fn) => fn(values)).join("");
}

export default compile;
