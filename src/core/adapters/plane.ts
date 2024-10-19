/**
 * Plane adapter
 *
 * The adapter extracts ticket information from the markup.
 */

import { match } from "micro-match";

import type { TicketData } from "../types";
import { $find, $text } from "./dom-helpers";
import { hasRequiredDetails } from "./utils";

async function scan(url: URL, document: Document): Promise<TicketData[]> {
  const ogUrl = <HTMLMetaElement> $find("[property~='og:url'][content]", document);
  if (!ogUrl || ogUrl.content !== "https://app.plane.so/") return [];

  let { issueType } = match("/:workspace/projects/:projectUuid/:issueType/:issueUuid/", url.pathname);
  if (issueType == "issues") {
    issueType = "feature";
  }

  const pageTitle = $text("title", document);
  const extract = pageTitle && pageTitle.match(/([A-Z]+-\d+)\s(.+)/);
  const id = extract && extract[1];
  const title = extract && extract[2];

  const tickets = [{
    id,
    url: url.toString(),
    title,
    type: issueType,
  }];

  return tickets.filter(hasRequiredDetails) as TicketData[];
}

export default scan;
