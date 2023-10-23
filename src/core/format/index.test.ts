import type { Ticket } from "../../types";
import format from ".";
import pprint from "./pretty-print";

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
    const fmt = format({ commit: "", branch: "", command: "" }, false);

    describe("commit", () => {
      it("includes ticket id and title", async () => {
        expect(await fmt.commit(ticket)).toMatchInlineSnapshot(
          `"[#BTC-042] Add more tests for src/common/format/index.js"`
        );
      });
    });

    describe("branch", () => {
      it("includes ticket type, id and title", async () => {
        expect(await fmt.branch(ticket)).toMatchInlineSnapshot(
          `"new-enhancement/btc-042-add-more-tests-for-src-common-format-index-js"`
        );
      });
    });

    describe("command", () => {
      it("includes the quoted branch name and commit message", async () => {
        expect(await fmt.command(ticket)).toMatchInlineSnapshot(
          `"git checkout -b 'new-enhancement/btc-042-add-more-tests-for-src-common-format-index-js' && git commit --allow-empty -m '[#BTC-042] Add more tests for src/common/format/index.js'"`
        );
      });
    });
  });

  describe("with template overrides", () => {
    (["branch", "commit", "command"] as const).forEach((key) => {
      describe(`${key}`, () => {
        it("renders the custom template", async () => {
          const template = `${key}-formatted`;
          const fmt = format({ [key]: template }, false);
          const formatted = await fmt[key](ticket);
          expect(formatted).toBe(template);
        });
      });
    });
  });

  describe("with pretty-printing enabled", () => {
    const stdfmt = format({}, false);
    const fmt = format({}, true);

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
