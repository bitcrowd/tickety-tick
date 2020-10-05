/**
 * Gitlab adapter
 *
 * The adapter uses the DOM to extract information about tickets.
 */

import { $has, $text } from './helpers';

function findTicketId(doc) {
  const initialDataEl = doc.getElementById('js-issuable-app-initial-data');

  if (initialDataEl !== null) {
    // Legacy approach of extracting the ticket id, left in place to support
    // older self-hosted GitLab installations
    const initialData = JSON.parse(
      initialDataEl.innerHTML.replace(/&quot;/g, '"')
    );

    return initialData.issuableRef.match(/#(\d+)/)[1];
  }

  return doc.body.dataset.pageTypeId;
}

async function scan(loc, doc) {
  if (doc.body.dataset.page === 'projects:issues:show') {
    const id = findTicketId(doc);
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
