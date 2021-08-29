/**
 * GitHub and GitHub Enterprise adapter
 *
 * The adapter uses the DOM to extract ticket information from issues.
 */

import type { TicketData } from "../types";
import { $all, $has, $text, $value } from "./dom-helpers";
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
    issuesPage: ".js-check-all-container .js-issue-row.selected",
    issuesPageLabel: ".labels .IssueLabel",
    issuePage: ".js-issues-results .gh-header-number",
    issuePageLabel: '.js-issue-labels .sidebar-labels-style[title="bug"]',
  },
  legacy: {
    issuesPage: ".issues-listing .js-issue-row.selected",
    issuesPageLabel: ".labels .label",
    issuePage: ".issues-listing .gh-header-number",
    issuePageLabel: '.sidebar-labels .label[title="bug"]',
  },
};

async function attempt(
  doc: Document,
  select: typeof selectors[keyof typeof selectors]
) {
  // issue list page
  if ($has(select.issuesPage, doc)) {
    const issues = $all(select.issuesPage, doc);

    const tickets = issues.map((issue) => {
      const id = $value("input.js-issues-list-check", issue);
      const title = $text("a.js-navigation-open", issue);
      const labels = $all(select.issuesPageLabel, issue);
      const type = labels.some((l) => /bug/i.test(`${l.textContent}`))
        ? "bug"
        : "feature";

      return { id, title, type };
    });

    return tickets;
  }

  // single issue page
  if ($has(select.issuePage, doc)) {
    const id = $text(".gh-header-number", doc)?.replace(/^#/, "");
    const title = $text(".js-issue-title", doc);
    const type = $has(select.issuePageLabel, doc) ? "bug" : "feature";
    const tickets = [{ id, title, type }];
    return tickets;
  }

  // project page
  if ($has(".project-columns .project-card", doc)) {
    const openProjectCardSelector =
      ".project-columns .project-card[data-card-state='[\"open\"]']";
    const projectCards = $all(openProjectCardSelector, doc);

    const tickets = projectCards.map((card) => {
      const id = JSON.parse(card.dataset.cardTitle ?? "null").slice(-2, -1)[0];
      const type = JSON.parse(card.dataset.cardLabel ?? "null").includes("bug")
        ? "bug"
        : "feature";
      const title = $text("a.h5", card);

      return { id, title, type };
    });

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
