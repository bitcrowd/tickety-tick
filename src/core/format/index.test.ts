import type { Ticket } from "../../types";
import format, { helpers } from ".";
import pprint from "./pretty-print";
import type { Formatter } from "./types";

jest.mock("./pretty-print", () => jest.fn());

describe("ticket formatting", () => {
  const ticket: Ticket = {
    id: "BTC-042",
    title: "Add more tests for src/common/format/index.js",
    type: "new enhancement",
  };

  beforeEach(() => {
    (pprint as jest.Mock).mockClear();
  });

  describe("default format", () => {
    let fmt: Formatter;
    beforeEach(async () => {
      fmt = await format({ commit: "", branch: "", command: "" }, false);
    });

    describe("commit", () => {
      it("includes ticket id and title", async () => {
        const formatted = await fmt.commit(ticket);
        expect(formatted).toBe(`[#${ticket.id}] ${ticket.title}`);
      });
    });

    describe("branch", () => {
      const slugify = helpers.slugify();

      it("includes ticket type, id and title", async () => {
        const formatted = await fmt.branch(ticket);
        expect(formatted).toBe(
          `${slugify(ticket.type)}/${slugify(ticket.id)}-${slugify(
            ticket.title,
          )}`,
        );
      });
    });

    describe("command", () => {
      const shellquote = helpers.shellquote();

      it("includes the quoted branch name and commit message", async () => {
        const branch = await fmt.branch(ticket);
        const commit = await fmt.commit(ticket);

        const formatted = await fmt.command(ticket);

        expect(formatted).toBe(
          `git checkout -b ${shellquote(branch)}` +
            ` && git commit --allow-empty -m ${shellquote(commit)}`,
        );
      });
    });
  });

  describe("with template overrides", () => {
    (["branch", "commit", "command"] as const).forEach((key) => {
      describe(`${key}`, () => {
        it("renders the custom template", async () => {
          const template = `${key}-formatted`;
          const fmt = await format({ [key]: template }, false);
          const formatted = await fmt[key](ticket);
          expect(formatted).toBe(template);
        });
      });
    });
  });

  describe("with pretty-printing enabled", () => {
    let stdfmt: Formatter;
    let fmt: Formatter;
    beforeEach(async () => {
      stdfmt = await format({}, false);
      fmt = await format({}, true);
    });

    describe("commit", () => {
      it("is pretty-printed", async () => {
        (pprint as jest.Mock).mockReturnValue("pretty-printed commit");
        const original = await stdfmt.commit(ticket);
        const formatted = await fmt.commit(ticket);
        expect(pprint).toHaveBeenCalledWith(original);
        expect(formatted).toBe("pretty-printed commit");
      });
    });
  });
});
