export default function observe(specifier, fn) {
  const query = window.matchMedia(specifier);
  query.addEventListener('change', ({ matches }) => fn(matches));
  fn(query.matches);
}
