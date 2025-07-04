/**
 * @jest-environment node
 */

import { JSDOM } from "jsdom";

import scan from "./gitlab";

const ISSUEPAGE = `
  <body data-page-type-id="22578">
    <div class="content">
      <div class="issue-details">
        <div class="detail-page-description">
          <h2 class="title">A Random GitLab Issue</h2>
        </div>
      </div>
    </div>
  </body>
`;

const NEWISSUEPAGE = `
  <body data-page="projects:issues:show" data-page-type-id="18">
    <div data-testid="work-item-type">
      <h1 data-testid="work-item-title">A Random GitLab Issue</h1>
    </div>
  </body>
`;

const LEGACYISSUE = `
  <div class="content">
    <div class="issue-details">
      <script id="js-issuable-app-initial-data" type="application/json">
        {&quot;issuableRef&quot;:&quot;#22578&quot;}
      </script>
      <div class="detail-page-description">
        <h2 class="title">A Random GitLab Issue</h2>
      </div>
    </div>
  </div>
`;

const BUGPAGE = `
  <div class="content">
    <div class="issue-details">
      <script id="js-issuable-app-initial-data" type="application/json">
        {&quot;issuableRef&quot;:&quot;#22578&quot;}
      </script>
      <div class="detail-page-description">
        <h2 class="title">A Random GitLab Issue</h2>
      </div>
    </div>
    <aside>
      <div class="issueable-sidebar">
        <div class="block labels">
          <div class="sidebar-collapsed-icon js-sidebar-labels-tooltip" data-container="body" data-placement="left" data-original-title="bug">
            <i aria-hidden="true" data-hidden="true" class="fa fa-tags"></i>
            <span>1</span>
          </div>
        </div>
      </div>
    </aside
  </div>
`;

const NEWBUGPAGE = `
  <body data-page="projects:issues:show" data-page-type-id="1">
    <div data-testid="work-item-type">
      <h1 data-testid="work-item-title">test</h1>
    </div>
    <section data-testid="work-item-labels">
      <span data-testid="bug">bug</span>
    </section>
  </body>
`;

describe("gitlab adapter", () => {
  const url = new URL("https://x.yz");

  function doc(body = "", dataPage = "") {
    const { window } = new JSDOM(
      `<html><body data-page="${dataPage}">${body}</body></html>`,
    );
    return window.document;
  }

  it("returns an empty array if it is on a different page", async () => {
    const result = await scan(url, doc());
    expect(result).toEqual([]);
  });

  it("extracts tickets from issue pages", async () => {
    const result = await scan(url, doc(ISSUEPAGE, "projects:issues:show"));
    expect(result).toEqual([
      { id: "22578", title: "A Random GitLab Issue", type: "feature" },
    ]);
  });

  it("extracts tickets from new issue pages", async () => {
    const result = await scan(url, doc(NEWISSUEPAGE, "projects:issues:show"));
    expect(result).toEqual([
      { id: "18", title: "A Random GitLab Issue", type: "feature" },
    ]);
  });

  it("extracts tickets from legacy issue pages", async () => {
    const result = await scan(url, doc(LEGACYISSUE, "projects:issues:show"));
    expect(result).toEqual([
      { id: "22578", title: "A Random GitLab Issue", type: "feature" },
    ]);
  });

  it("recognizes issues labelled as bugs", async () => {
    const result = await scan(url, doc(BUGPAGE, "projects:issues:show"));
    expect(result).toEqual([
      { id: "22578", title: "A Random GitLab Issue", type: "bug" },
    ]);
  });

  it("recognizes issues labelled as bugs on the new page", async () => {
    const result = await scan(url, doc(NEWBUGPAGE, "projects:issues:show"));
    expect(result).toEqual([{ id: "1", title: "test", type: "bug" }]);
  });
});
