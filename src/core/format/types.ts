import type { Ticket } from "../../types";

type FormatFunction = (ticket: Ticket) => string;

export interface Formatter {
  branch: FormatFunction;
  commit: FormatFunction;
  command: FormatFunction;
}

export type Templates = {
  branch: string;
  commit: string;
  command: string;
};
