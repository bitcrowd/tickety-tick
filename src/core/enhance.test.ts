import type { Ticket } from "../types";
import enhance from "./enhance";
import format, { defaults } from "./format";

describe("ticket enhancer", () => {
  const ticket: Ticket = {
    id: "BTC-042",
    title: "Add more tests for src/common/format.js",
    type: "enhancement",
  };

  const templates = defaults;

  it('attaches format output to tickets as "fmt" property', async () => {
    const fmt = format(templates);
    const enhancer = enhance(templates, false);

    expect(await enhancer(ticket)).toEqual({
      ...ticket,
      fmt: {
        branch: await fmt.branch(ticket),
        commit: await fmt.commit(ticket),
        command: await fmt.command(ticket),
      },
    });
  });
});
