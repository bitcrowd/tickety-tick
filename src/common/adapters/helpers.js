/* global $$$ */

function trim(string) {
  return string.replace(/^\s+|\s+$/g, '');
}

function $data(context, key) {
  const node = $$$(context);
  return node.data(key);
}

function $attr(selector, context, key) {
  const node = $$$(selector, context);
  return node.attr(key);
}

function $has(selector, context) {
  const nodes = $$$(selector, context);
  return nodes.length > 0;
}

function $classed(context, cls) {
  return $$$(context).hasClass(cls);
}

function $find(selector, context) {
  return $$$(selector, context);
}

function $map(collection, fn) {
  return $$$(collection).map(fn).get();
}

function $text(selector, context) {
  const txt = $$$(selector, context).text();
  return trim(txt);
}

function $value(selector, context) {
  const val = $$$(selector, context).val();
  return trim(val);
}

export {
  $data,
  $attr,
  $find,
  $has,
  $classed,
  $map,
  $text,
  $value,
  trim
};
