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

import { match } from 'micro-match';

import { $all, $has, $text } from './helpers';

/**
 * Tara has two ticket views, one in a modal-like overlay, one in full-page view.
 */
function isModalView(doc) {
  const modalViewSelector = 'input[data-cy="requirement-detail-name-input"]';
  return $has(modalViewSelector, doc);
}

function extractDescription(doc) {
  const editorRootNodes = $all('.DraftEditor-root', doc);

  if (isModalView(doc)) editorRootNodes.shift(); // Skip project information editor node

  const textNodes = $all('span[data-text="true"]', editorRootNodes[0]);

  return textNodes.map((node) => node.textContent).join('\n');
}

async function scan(loc, doc) {
  if (loc.host !== 'app.tara.ai') return [];

  const { index } = match('/:workspace/tasks/:index', loc.pathname);

  if (!index) return [];

  const id = $text('span[data-cy="task-modal-task-id-text"]', doc);
  const description = extractDescription(doc);
  const title = $text('textarea[data-cy="task-modal-task-name-text"]', doc);
  const type = 'feature';
  const url = loc.href;

  return [{ id, title, type, description, url }];
}

export default scan;
