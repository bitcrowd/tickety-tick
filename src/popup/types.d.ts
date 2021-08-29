import type { Ticket } from "../types";

export type BackgroundPage = Window & {
  getTickets: () => { tickets: Ticket[]; errors: Error[] };
};
