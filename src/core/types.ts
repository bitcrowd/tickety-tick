import type { Ticket } from "../types";
import type defaults from "./defaults";

export type TicketData = Omit<Ticket, keyof typeof defaults> & Partial<Ticket>;

export type Adapter = (url: URL, document: Document) => Promise<TicketData[]>;
