export default function loc(host, pathname = '/', search = '') {
  const href = `https://${host}${pathname}${search}`;

  return {
    host,
    href,
    pathname,
    search,
  };
}
