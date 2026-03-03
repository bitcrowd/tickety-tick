import { Headers as HeadersPolyfill } from "headers-polyfill";

// NOTE: With manifest v3, Firefox does not have an up to date implementation of
// the `Headers` class. This breaks our HTTP client based on `ky`.
// Therefore we use a polyfill for this:
//
// TODO: Remove this type assertion once the `headers-polyfill` package is
// updated and my PR is merged (https://github.com/mswjs/headers-polyfill/pull/82).
// TypeScript v5.2+ requires `[Symbol.dispose]` on any `InterableIterator` type
// and the polyfills iterators don't yet implement this.
globalThis.Headers = HeadersPolyfill as unknown as typeof Headers;
