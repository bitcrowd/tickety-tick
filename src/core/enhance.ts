import type { Ticket, TicketWithFmt } from "../types";
import format from "./format";
import type { Templates } from "./format/types";

function enhancer(templates: Partial<Templates>, autofmt: boolean) {
  const fmt = format(templates, autofmt);

  const enhance = (ticket: Ticket): TicketWithFmt =>
    Object.assign(ticket, {
      fmt: {
        branch: fmt.branch(ticket),
        commit: fmt.commit(ticket),
        command: fmt.command(ticket),
      },
    });

  return enhance;
}

export default enhancer;
