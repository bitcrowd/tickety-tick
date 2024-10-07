import type { ErrorObject } from "../errors";
import type { Ticket } from "../types";

export type BackgroundPage = Window & {
  getTickets: () => { tickets: Ticket[]; errors: ErrorObject[] };
};

export type BackgroundWorker = {
  getTickets: () => { tickets: Ticket[]; errors: ErrorObject[] };
};
