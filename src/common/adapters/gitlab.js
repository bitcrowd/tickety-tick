import { $has, $text } from './helpers';

const adapter = {
  inspect(loc, doc, fn) {
    if (doc.body.dataset.page === 'projects:issues:show') {
      const initialDataEl = doc.getElementById('js-issuable-app-initial-data');
      const initialData = JSON.parse(initialDataEl.innerHTML.replace(/&quot;/g, '"'));

      const id = initialData.issuableRef.match(/#(\d+)/)[1];
      const title = $text('.issue-details .title', doc);
      const type = $has('.labels [data-original-title="bug"]', doc) ? 'bug' : 'feature';
      const tickets = [{ id, title, type }];
      return fn(null, tickets);
    }

    return fn(null, null);
  },
};

export default adapter;
