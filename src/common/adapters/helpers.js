function trim(string) {
  return string ? string.replace(/^\s+|\s+$/g, '') : null;
}

// Finders

function $find(selector, context) {
  return context.querySelector(selector);
}

function $all(selector, context) {
  return Array.from(context.querySelectorAll(selector));
}

// Traversal

function $closest(selector, context) {
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

function $attr(selector, context, key) {
  const node = $find(selector, context);
  return node ? node.getAttribute(key) : null;
}

function $classed(node, cls) {
  return node.classList.contains(cls);
}

function $data(node, key) {
  return node.dataset[key];
}

function $has(selector, context) {
  return $find(selector, context) !== null;
}

function $text(selector, context) {
  const node = $find(selector, context);
  return node ? trim(node.textContent) : null;
}

function $value(selector, context) {
  const node = $find(selector, context);
  return node ? trim(node.value || node.getAttribute('value')) : null;
}

export {
  $all,
  $attr,
  $classed,
  $closest,
  $data,
  $find,
  $has,
  $text,
  $value,
  trim,
};
