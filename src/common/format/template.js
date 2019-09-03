const trim = (s) => s.replace(/^\s+|\s+$/g, '');
const identity = (x) => x;

function compile(template, transforms = {}) {
  const parts = template.match(/\{[^}]*\}|[^{]+/g);

  if (!parts) return () => template;

  const fns = parts.map((part) => {
    if (part[0] === '{' && part[part.length - 1] === '}') {
      const [key, ...procs] = part
        .replace(/^\{|\}$/g, '')
        .split('|')
        .map(trim);

      const pipeline = procs.map((name) => transforms[name] || identity);

      return (values) => pipeline.reduce((v, fn) => fn(v), values[key] || '');
    }

    return () => part;
  });

  return (values = {}) => fns.map((fn) => fn(values)).join('');
}

export default compile;
