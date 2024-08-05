/**
 * @jest-environment node
 */

import { JSDOM } from "jsdom";

import scan from "./clickup";

const pages = {
  issuePage: {
    url: new URL("https://app.clickup.com/t/8790abcde"),
    document: "<title>A nice ticket | #8790abcde</title>",
  },
  boardPage: {
    url: new URL("https://app.clickup.com/4637546/v/b/6-123456789-2"),
  },
};

describe("clickup adapter", () => {
  function doc(body = "") {
    const { window } = new JSDOM(`<html><body>${body}</body></html>`);
    return window.document;
  }

  it("returns an empty array if it is on the board", async () => {
    const result = await scan(pages.issuePage.url, doc());
    expect(result).toEqual([]);
  });

  it("returns an empty array if it is on a different page", async () => {
    const result = await scan(new URL("https://example.com"), doc());
    expect(result).toEqual([]);
  });

  it("extracts the ticket from the issue page", async () => {
    const result = await scan(
      pages.issuePage.url,
      doc(pages.issuePage.document),
    );
    expect(result).toEqual([
      {
        id: "8790abcde",
        title: "A nice ticket",
        type: "task",
        url: "https://app.clickup.com/t/8790abcde",
      },
    ]);
  });
});
