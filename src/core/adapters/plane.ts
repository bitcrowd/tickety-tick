/**
 * Plane adapter
 *
 * The adapter extracts ticket information from the markup.
 */

import { match } from "micro-match";

import type { TicketData } from "../types";
import { $text } from "./dom-helpers";

async function scan(url: URL, document: Document): Promise<TicketData[]> {
  const checkForPlane = document.querySelector("[property~='og:title'][content]");
  if (!checkForPlane || !checkForPlane.content.startsWith("Plane")) return [];

  let { issueType } = match("/:workspace/projects/:projectId/:issueType/:id/", url.pathname);
  if (issueType == "issues") {
    issueType = "feature";
  }
  const pageTitle = $text("title", document);
  const extract = pageTitle && pageTitle.match(/([A-Z]+-\d+)\s(.+)/);
  const id = extract && extract[1];
  const title = extract && extract[2];

  if (!id) return [];

  const ticket = {
    id,
    url: url.toString(),
    title,
    type: issueType,
  } as TicketData;

  return [ticket];
}

export default scan;
