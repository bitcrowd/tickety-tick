import type { Ticket, TicketWithFmt } from "../types";
import format from "./format";
import type { Templates } from "./format/types";

async function enhancer(templates: Partial<Templates>, autofmt: boolean) {
  const fmt = await format(templates, autofmt);

  const enhance = async (ticket: Ticket): Promise<TicketWithFmt> =>
    Object.assign(ticket, {
      fmt: {
        branch: await fmt.branch(ticket),
        commit: await fmt.commit(ticket),
        command: await fmt.command(ticket),
      },
    });

  return enhance;
}

export default enhancer;
