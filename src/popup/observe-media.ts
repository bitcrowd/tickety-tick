export default function observe(
  specifier: string,
  fn: (_: boolean) => void
): void {
  const query = window.matchMedia(specifier);
  query.addEventListener("change", ({ matches }) => fn(matches));
  fn(query.matches);
}
