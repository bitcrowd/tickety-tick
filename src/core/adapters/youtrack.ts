/**
 * YouTrack adapter
 *
 * The adapter uses the DOM to extract ticket information from issues.
 */

import type { TicketData } from "../types";
import { $has, $text } from "./dom-helpers";
import { hasRequiredDetails } from "./utils";

async function scan(url: URL, document: Document): Promise<TicketData[]> {
  if (!$has(".yt-issue-view", document)) return [];

  const id = $text(".js-issue-id", document)?.trim();
  const title = $text("[data-test='issueSummary']", document);
  const type =
    $text("[data-test='Type']", document)?.toLowerCase().trim() || "feature";

  const tickets = [{ id, title, type, url: url.toString() }];

  return tickets.filter(hasRequiredDetails) as TicketData[];
}

export default scan;
