export type Ticket = {
  id: string;
  type: string;
  title: string;
  description?: string;
  url?: string;
};

export type Fmt = {
  commit: string;
  branch: string;
  command: string;
};

export type TicketWithFmt = Ticket & { fmt: Fmt };

export type BackgroundMessage = {
  getTickets?: boolean;
};

export type ContentMessage = {
  tickets?: boolean;
};
