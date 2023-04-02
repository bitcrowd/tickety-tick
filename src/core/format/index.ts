import { Liquid } from "liquidjs";

import type { Ticket } from "../../types";
import * as defaults from "./defaults";
import * as extras from "./filters";
import pprint from "./pretty-print";
import type { Formatter, Templates } from "./types";

export { defaults };

const engine = new Liquid({});

Object.entries(extras).forEach(([name, filter]) => {
  engine.registerFilter(name, filter);
});

export const { filters } = engine;

const trim = (s: string) => s.trim();

export default (
  templates: Partial<Templates> = {},
  prettify = true
): Formatter => {
  const compile = <T extends Ticket>(name: keyof Templates) => {
    const tpl = engine.parse(templates[name] || defaults[name]);
    return (ticket: T) => engine.render(tpl, ticket).then(trim);
  };

  const branch = compile("branch");

  const commit = ((render) =>
    prettify ? async (ticket: Ticket) => pprint(await render(ticket)) : render)(
    compile("commit")
  );

  const command = (
    (render) => async (ticket: Ticket) =>
      render({
        branch: await branch(ticket),
        commit: await commit(ticket),
        ...ticket,
      })
  )(compile<Ticket & { branch: string; commit: string }>("command"));

  return { branch, command, commit };
};
