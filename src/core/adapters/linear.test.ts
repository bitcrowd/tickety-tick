/**
 * @jest-environment node
 */

import { JSDOM } from "jsdom";

import scan from "./linear";

const pages = {
  issuePage: {
    url: new URL(
      "https://linear.app/my_team/issue/FOO-1/do-something-interesting",
    ),
    document: "<span title='Edit issue title'>Do something interesting</span>",
  },
};

describe("linear adapter", () => {
  function doc(body = "") {
    const { window } = new JSDOM(`<html><body>${body}</body></html>`);
    return window.document;
  }

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
        id: "FOO-1",
        title: "Do something interesting",
        type: "issue",
        url: pages.issuePage.url.toString(),
      },
    ]);
  });
});
