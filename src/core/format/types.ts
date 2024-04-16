import type { Ticket } from "../../types";

type AsyncFormatFunction = (ticket: Ticket) => Promise<string>;
type FormatFunction = (ticket: Ticket) => string;

export interface Formatter {
  branch: FormatFunction;
  commit: AsyncFormatFunction;
  command: AsyncFormatFunction;
}

export type Templates = {
  branch: string;
  commit: string;
  command: string;
};
