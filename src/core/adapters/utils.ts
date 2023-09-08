import type { TicketData } from "../types";

// eslint-disable-next-line import/prefer-default-export
export function hasRequiredDetails(
  obj: Record<string, unknown>,
): obj is TicketData {
  return typeof obj.id === "string" && typeof obj.title === "string";
}
