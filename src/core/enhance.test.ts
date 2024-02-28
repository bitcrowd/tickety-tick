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
    const formatter = await format(templates);
    const enhancer = await enhance(templates, false);

    expect(await enhancer(ticket)).toEqual({
      ...ticket,
      fmt: {
        branch: await formatter.branch(ticket),
        commit: await formatter.commit(ticket),
        command: await formatter.command(ticket),
      },
    });
  });
});
