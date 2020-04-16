/**
 * Gitlab adapter
 *
 * The adapter uses the DOM to extract information about tickets.
 */

import { $has, $text } from './helpers';

async function scan(loc, doc) {
  if (doc.body.dataset.page === 'projects:issues:show') {
    const initialDataEl = doc.getElementById('js-issuable-app-initial-data');
    const initialData = JSON.parse(
      initialDataEl.innerHTML.replace(/&quot;/g, '"')
    );

    const id = initialData.issuableRef.match(/#(\d+)/)[1];
    const title = $text('.issue-details .title', doc);
    const type = $has('.labels [data-original-title="bug"]', doc)
      ? 'bug'
      : 'feature';
    const tickets = [{ id, title, type }];

    return tickets;
  }

  return [];
}

export default scan;
