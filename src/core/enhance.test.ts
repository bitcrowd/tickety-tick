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

  it('attaches format output to tickets as "fmt" property', () => {
    const formatter = format(templates);
    const enhancer = enhance(templates, false);

    expect(enhancer(ticket)).toEqual({
      ...ticket,
      fmt: {
        branch: formatter.branch(ticket),
        commit: formatter.commit(ticket),
        command: formatter.command(ticket),
      },
    });
  });
});
