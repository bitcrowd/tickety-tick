export function trim(string: string | null) {
  return string ? string.replace(/^\s+|\s+$/g, "") : null;
}

// Finders

export function $find(selector: string, context: HTMLDocument | HTMLElement) {
  return context.querySelector<HTMLElement>(selector);
}

export function $all(selector: string, context: HTMLDocument | HTMLElement) {
  return Array.from(context.querySelectorAll<HTMLElement>(selector));
}

export function $has(selector: string, context: HTMLDocument | HTMLElement) {
  return $find(selector, context) !== null;
}

// Properties

export function $text(selector: string, context: HTMLDocument | HTMLElement) {
  const node = $find(selector, context);
  return node ? trim(node.textContent) : null;
}

export function $value(selector: string, context: HTMLDocument | HTMLElement) {
  const node = $find(selector, context);
  return node ? trim(node.getAttribute("value")) : null;
}
