/**
 * Gitlab adapter
 *
 * The adapter uses the DOM to extract information about tickets.
 */

import type { TicketData } from "../types";
import { $find, $has, $text } from "./dom-helpers";
import { hasRequiredDetails } from "./utils";

function findTicketId(document: Document) {
  const id = document.body.dataset.pageTypeId;
  if (id) return id;

  // Legacy approach of extracting the ticket id, left in place to support
  // older self-hosted GitLab installations
  const element = $find("#js-issuable-app-initial-data", document);
  if (element === null) return undefined;

  const data = JSON.parse(element.innerHTML.replace(/&quot;/g, '"'));
  return data?.issuableRef.match(/#(\d+)/)[1];
}

async function scan(url: URL, document: Document): Promise<TicketData[]> {
  if (document.body.dataset.page === "projects:issues:show") {
    const id = findTicketId(document);
    const title = $text(".issue-details .title", document);
    const type = $has('.labels [data-original-title="bug"]', document)
      ? "bug"
      : "feature";

    const ticket = { id, title, type };

    if (hasRequiredDetails(ticket)) return [ticket];

    return [];
  }

  return [];
}

export default scan;
