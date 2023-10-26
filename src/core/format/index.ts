import type { Ticket } from "../../types";
import * as defaults from "./defaults";
import * as helpers from "./helpers";
import pprint from "./pretty-print";
import compile from "./template";
import type { Formatter, Templates } from "./types";

export { defaults, helpers };

function format<T extends Ticket>(
  templates: Partial<Templates>,
  name: keyof Templates,
) {
  const render = compile(templates[name] || defaults[name], helpers);
  return (ticket: T) => render(ticket).trim();
}

export default async (
  templates: Partial<Templates> = {},
  prettify = true,
): Promise<Formatter> => {
  const branch = format(templates, "branch");

  const commit = prettify
    ? async (ticket: Ticket) => pprint(format(templates, "commit")(ticket))
    : format(templates, "commit");

  const command = async (ticket: Ticket) =>
    format<Ticket & { branch: string; commit: string }>(
      templates,
      "command",
    )({
      branch: branch(ticket),
      commit: await commit(ticket),
      ...ticket,
    });

  return { branch, command, commit };
};
