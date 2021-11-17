import type { ErrorObject } from "serialize-error";
import { deserializeError, serializeError } from "serialize-error";

// Make error objects JSON-serializable/deserializable so error details do not
// get lost between the content script and the extension popup.

export type { ErrorObject };

export const serialize = (error: Error): ErrorObject => serializeError(error);

export const deserialize = (error: ErrorObject): Error =>
  deserializeError(error);
