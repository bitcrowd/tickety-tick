/**
 * @jest-environment node
 */

import { JSDOM } from "jsdom";

import scan, { selectors } from "./github";

const pages = {
  default: {
    issuepage: `
      <div data-testid="issue-viewer-container">
        <div data-component="TitleArea" data-size-variant="medium">
          <h1 data-component="PH_Title" data-hidden="false">
            <bdi class="markdown-title" data-testid="issue-title">A Random GitHub Issue</bdi>
            <span>#12</span>
          </h1>
        </div>
      </div>`,
    bugpage: `
      <div data-testid="issue-viewer-container">
        <div aria-label="Header" role="region" data-testid="issue-header">
          <div data-component="TitleArea" data-size-variant="medium">
            <h1 data-component="PH_Title" data-hidden="false">
              <bdi class="markdown-title" data-testid="issue-title">A Random GitHub Issue</bdi>
              <span>#12</span>
            </h1>
          </div>
        </div>
        <div data-testid="issue-viewer-metadata-pane">
          <div data-testid="sidebar-section">
            <div data-testid="issue-type-container">
              <div>
                <a href="/bitcrowd/tickety-tick/issues?q=type:&quot;Bug&quot;">
                  <span data-color="RED">
                    <span>
                      <span>Bug</span>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>`,
  },
  legacy: {
    issuepage: `
      <div class="js-issues-results">
        <h1 class="gh-header-title">
          <span class="js-issue-title">A Random GitHub Issue</span>
          <span class="gh-header-number">#12</span>
        </h1>
      </div>`,
    bugpage: `
      <div class="js-issues-results">
        <h1 class="gh-header-title">
          <span class="js-issue-title">A Random GitHub Issue</span>
          <span class="gh-header-number">#12</span>
        </h1>
        <div class="js-issue-labels">
          <a class="IssueLabel hx_IssueLabel" data-name="bug">bug</a>
        </div>
      </div>`,
  },
};

const url = (path: string) =>
  new URL(`https://github.com/test-org/test-project/${path}`);

Object.keys(selectors).forEach((variant) => {
  const html = pages[variant as keyof typeof selectors];

  describe(`github adapter (${variant})`, () => {
    function doc(body = "") {
      const { window } = new JSDOM(`<html><body>${body}</body></html>`);
      return window.document;
    }

    it("returns an empty array if it is on a different page", async () => {
      const result = await scan(new URL("https://example.net"), doc());
      expect(result).toEqual([]);
    });

    it("extracts tickets from issue pages", async () => {
      const result = await scan(url("issues/12"), doc(html.issuepage));
      expect(result).toEqual([
        {
          id: "12",
          title: "A Random GitHub Issue",
          type: "feature",
          url: "https://github.com/test-org/test-project/issues/12",
        },
      ]);
    });

    it("recognizes issue types", async () => {
      const result = await scan(url("issues/12"), doc(html.bugpage));
      expect(result).toEqual([
        {
          id: "12",
          title: "A Random GitHub Issue",
          type: "bug",
          url: "https://github.com/test-org/test-project/issues/12",
        },
      ]);
    });
  });
});
