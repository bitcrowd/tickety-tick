/* eslint-disable import/prefer-default-export */

import type { Ticket, TicketWithFmt } from "../src/types";

export function ticket(overrides: Partial<Ticket> = {}): TicketWithFmt {

  const defaults = { id: "1", title: "ticket title", type: "feature" };

  const base = { ...defaults, ...overrides };

  const branch = `branch-${base.id}`;
  const commit = `commit-${base.id}`;
  const command = `command-${base.id}`;

  const fmt = { branch, commit, command };

  return { ...base, fmt };
}
