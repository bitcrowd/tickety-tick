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

// Traversal

export function $closest(selector, context) {
  if (typeof context.closest !== 'function') {
    // Shim Element.closest for browsers that do not support it (and jsdom):
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    let node = context;

    while (node && node.nodeType === 1) {
      if (node.matches(selector)) return node;
      node = node.parentNode;
    }

    return null;
  }

  return context.closest(selector);
}

// Properties

export function $attr(selector, context, key) {
  const node = $find(selector, context);
  return node ? node.getAttribute(key) : null;
}

export function $classed(node, cls) {
  return node.classList.contains(cls);
}

export function $data(node, key) {
  return node.dataset[key];
}

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
