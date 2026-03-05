import { Headers as HeadersPolyfill } from "headers-polyfill";

// NOTE: With manifest v3, Firefox does not have an up to date implementation of
// the `Headers` class. This breaks our HTTP client based on `ky`.
// Therefore we use a polyfill for this:
globalThis.Headers = HeadersPolyfill;
