/**
 * GitHub and GitHub Enterprise adapter
 *
 * The adapter uses the DOM to extract ticket information from issues.
 */

import type { TicketData } from "../types";
import { $has, $text } from "./dom-helpers";
import { hasRequiredDetails } from "./utils";

/**
 * DOM selectors
 *
 * Element classes on GitHub have slightly changed over time. To maintain
 * support for some older GitHub Enterprise instances, the adapter will attempt
 * different versions of selectors.
 */
export const selectors = {
  default: {
    issuePage: 'div[data-testid="issue-viewer-container"]',
    issueId: 'div[data-component="TitleArea"] span',
    issueTitle: 'div[data-component="TitleArea"] bdi.markdown-title',
  },
  legacy: {
    issuePage: ".js-issues-results .gh-header-number",
    issueId: ".gh-header-number",
    issueTitle: ".js-issue-title",
  },
};

async function attempt(
  doc: Document,
  select: (typeof selectors)[keyof typeof selectors],
) {
  // single issue page
  if ($has(select.issuePage, doc)) {
    const id = $text(select.issueId, doc)?.replace(/^#/, "");
    const title = $text(select.issueTitle, doc);

    if (!id || !title) return [];

    const type =
      $text('div[data-testid="issue-type-container"]', doc)
        ?.toLowerCase()
        .trim() || $has('.js-issue-labels .IssueLabel[data-name="bug" i]', doc)
        ? "bug"
        : "feature";

    const tickets = [{ id, title, type }];
    return tickets;
  }

  return [];
}

async function tryScanDefaultThenLegacy(doc: Document) {
  const tickets = await attempt(doc, selectors.default);
  if (tickets.length > 0) return tickets;
  return attempt(doc, selectors.legacy);
}

async function scan(url: URL, document: Document): Promise<TicketData[]> {
  const project = url.pathname.split("/").slice(1, 3).join("/");
  const tickets = await tryScanDefaultThenLegacy(document);
  return tickets.filter(hasRequiredDetails).map((ticket) => ({
    url: `https://github.com/${project}/issues/${ticket.id}`,
    ...ticket,
  })) as TicketData[];
}

export default scan;
