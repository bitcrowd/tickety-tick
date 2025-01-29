export function trim(string: string | null) {
  return string ? string.replace(/^\s+|\s+$/g, "") : null;
}

// Finders

export function $find(selector: string, context: Document | HTMLElement) {
  return context.querySelector<HTMLElement>(selector);
}

export function $all(selector: string, context: Document | HTMLElement) {
  return Array.from(context.querySelectorAll<HTMLElement>(selector));
}

export function $has(selector: string, context: Document | HTMLElement) {
  return $find(selector, context) !== null;
}

// Properties

export function $text(selector: string, context: Document | HTMLElement) {
  const node = $find(selector, context);
  return node ? trim(node.textContent) : null;
}

export function $value(selector: string, context: Document | HTMLElement) {
  const node = $find(selector, context);
  return node ? trim(node.getAttribute("value")) : null;
}
