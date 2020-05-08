export function trim(string) {
  return string ? string.replace(/^\s+|\s+$/g, '') : null;
}

// Finders

export function $find(selector, context) {
  return context.querySelector(selector);
}

export function $all(selector, context) {
  return Array.from(context.querySelectorAll(selector));
}

// Properties

export function $has(selector, context) {
  return $find(selector, context) !== null;
}

export function $text(selector, context) {
  const node = $find(selector, context);
  return node ? trim(node.textContent) : null;
}

export function $value(selector, context) {
  const node = $find(selector, context);
  return node ? trim(node.value || node.getAttribute('value')) : null;
}
