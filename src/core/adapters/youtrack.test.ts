/**
 * @jest-environment node
 */

import { JSDOM } from "jsdom";

import scan from "./youtrack";

const html = {
  issuepage: (type?: string) => `
    <div class="yt-issue-view">
      <span class="js-issue-id">TT-123</span>

      <h1 class="yt-issue-body__summary" data-test="issueSummary">
        Support YouTrack
      </h1>

      <button type="button" data-test="Type">
        <span>${type ?? ""}</span>
      </button>
    </div>
  `,
};

const url = new URL(
  "https://bitcrowd.youtrack.cloud/issue/TT-0/Support-YouTrack",
);

describe("youtrack adapter", () => {
  function doc(body = "") {
    const { window } = new JSDOM(`<html><body>${body}</body></html>`);
    return window.document;
  }

  it("returns an empty array if it is on a different page", async () => {
    const result = await scan(url, doc("other"));
    expect(result).toEqual([]);
  });

  it("extracts tickets from issue pages", async () => {
    const result = await scan(url, doc(html.issuepage("Feature")));
    expect(result).toEqual([
      {
        id: "TT-123",
        title: "Support YouTrack",
        type: "feature",
        url: url.toString(),
      },
    ]);
  });

  it("recognizes issues types", async () => {
    const result = await scan(url, doc(html.issuepage("Question")));
    expect(result).toEqual([
      {
        id: "TT-123",
        title: "Support YouTrack",
        type: "question",
        url: url.toString(),
      },
    ]);
  });
});
