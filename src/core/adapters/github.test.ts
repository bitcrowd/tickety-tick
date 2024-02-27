/**
 * @jest-environment node
 */

import { JSDOM } from "jsdom";

import scan, { selectors } from "./github";

const pages = {
  default: {
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
    indexpage: `
        <div class="js-check-all-container">
          <div>
            <div id="issue_12" class="js-issue-row selected">
              <input type="checkbox" class="js-issues-list-check" name="issues[]" value="12">
              <a href="/bitcrowd/tickety-tick/issues/12" class="h4 js-navigation-open">
                A Selected GitHub Issue
              </a>
              <span class="lh-default">
                <a href="#" class="IssueLabel">bug</a>
              </span>
            </div>
            <div id="issue_11" class="js-issue-row">
              <input type="checkbox" class="js-issues-list-check" name="issues[]" value="11">
              <a href="/bitcrowd/tickety-tick/issues/11" class="h4 js-navigation-open">
                A GitHub Issue
              </a>
            </div>
          </div>
        </div>`,
  },
  legacy: {
    issuepage: `
      <div class="issues-listing">
        <h1 class="gh-header-title">
          <span class="js-issue-title">A Random GitHub Issue</span>
          <span class="gh-header-number">#12</span>
        </h1>
      </div>`,

    bugpage: `
      <div class="issues-listing">
        <h1 class="gh-header-title">
          <span class="js-issue-title">A Random GitHub Issue</span>
          <span class="gh-header-number">#12</span>
        </h1>
        <div class="sidebar-labels">
          <a class="label" title="bug">bug</a>
        </div>
      </div>`,

    indexpage: `
      <div class="issues-listing">
        <ul>
          <li id="issue_12" class="js-issue-row selected">
            <input type="checkbox" class="js-issues-list-check" name="issues[]" value="12">
            <a href="/bitcrowd/tickety-tick/issues/12" class="h4 js-navigation-open">
              A Selected GitHub Issue
            </a>
            <span class="labels">
              <a href="#" class="label">bug</a>
            </span>
          </li>
          <li id="issue_11" class="js-issue-row">
            <input type="checkbox" class="js-issues-list-check" name="issues[]" value="11">
            <a href="/bitcrowd/tickety-tick/issues/11" class="h4 js-navigation-open">
              A GitHub Issue
            </a>
            <span class="labels"></span>
          </li>
        </ul>
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

    it("recognizes issues labelled as bugs", async () => {
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

    it("extracts tickets from issues index pages", async () => {
      const result = await scan(url("issues"), doc(html.indexpage));
      expect(result).toEqual([
        {
          id: "12",
          title: "A Selected GitHub Issue",
          type: "bug",
          url: "https://github.com/test-org/test-project/issues/12",
        },
      ]);
    });
  });
});
