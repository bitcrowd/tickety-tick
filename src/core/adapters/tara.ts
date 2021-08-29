/**
 * tara.ai adapter
 *
 * The adapter extracts the current task's identifier from the page URL
 * and uses the DOM to retrieve information for the corresponding ticket.
 * Page URLs follow the pattern:
 *
 *   https://app.tara.ai/<workspace-name>/tasks/<id>
 *
 * Each workspace has multiple projects (called "requirements"), task IDs
 * always start with `TASK-` followed by a 1-based index unique within the
 * given workspace.
 */

import { match } from "micro-match";

import type { TicketData } from "../types";
import { $all, $has, $text } from "./dom-helpers";
import { hasRequiredDetails } from "./utils";

/**
 * Tara has two ticket views, one in a modal-like overlay, one in full-page view.
 */
function isModalView(document: Document) {
  const modalViewSelector = 'input[data-cy="requirement-detail-name-input"]';
  return $has(modalViewSelector, document);
}

function extractDescription(document: Document) {
  const editorRootNodes = $all(".DraftEditor-root", document);

  if (isModalView(document)) editorRootNodes.shift(); // Skip project information editor node

  const textNodes = $all('span[data-text="true"]', editorRootNodes[0]);

  return textNodes.map((node) => node.textContent).join("\n");
}

async function scan(url: URL, document: Document): Promise<TicketData[]> {
  if (url.host !== "app.tara.ai") return [];

  const { index } = match("/:workspace/tasks/:index", url.pathname);

  if (!index) return [];

  const id = $text('span[data-cy="task-modal-task-id-text"]', document);
  const title = $text(
    'textarea[data-cy="task-modal-task-name-text"]',
    document
  );
  const description = extractDescription(document);

  const ticket = { id, title, description, url: url.toString() };

  if (hasRequiredDetails(ticket)) return [ticket];

  return [];
}

export default scan;
