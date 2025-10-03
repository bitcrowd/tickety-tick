/**
 * Polarion adapter
 *
 * The adapter extracts ticket information from Polarion workitem using DOM
 * selectors.
 */

import type { TicketData } from "../types";
import { $text } from "./dom-helpers";

async function scan(url: URL, document: Document): Promise<TicketData[]> {
  const polarionTitle = $text(
    ".polarion-WorkItem-Title a.polarion-Hyperlink",
    document,
  );
  const type =
    $text("#FIELD_type .polarion-JSEnumOption", document)
      ?.toLowerCase()
      .trim() === "bug"
      ? "bug"
      : "feature";
  const description = $text("#FIELD_description .polarion-TextField", document);

  if (!polarionTitle || !type || !description) return [];

  // polarionTitle follows the pattern "RC-654 - Title"
  const match = polarionTitle.match(/^([A-Z0-9]+-[0-9]+)\s*[-:]\s*(.+)$/);

  if (!match || match.length !== 3) return [];

  return [
    {
      id: match[1],
      title: match[2].trim(),
      description,
      type: type.toLowerCase(),
      url: url.toString(),
    },
  ];
}

export default scan;
