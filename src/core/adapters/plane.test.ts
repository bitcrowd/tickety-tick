/**
 * @jest-environment node
 */

import { JSDOM } from "jsdom";

import scan from "./plane";

const pages = {
  issuePage: {
    url: new URL(
      "https://app.plane.so/my_team/projects/e9460bd9-2967-4c5e-8d95-24b053e6965d/issues/9210a612-338b-4620-a834-07a89a26bf65/",
    ),
    document: "<title>FOO-1 Do something interesting</title><meta property='og:title' content='Plane | Simple, extensible, open-source project management tool.'>",
  },
};

describe("plane adapter", () => {
  function doc(head = "") {
    const { window } = new JSDOM(`<html><head>${head}</head><body></body></html>`);
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
        type: "feature",
        url: pages.issuePage.url.toString(),
      },
    ]);
  });
});
