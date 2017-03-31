import { $has, $text } from './helpers';

const adapter = {
  inspect(loc, doc, fn) {
    if ($has('.issue-details', doc)) {
      const id = $text('.detail-page-header .issuable-meta .identifier', doc).match(/#(\d+)/)[1];
      const title = $text('.issue-details .detail-page-description .title', doc);
      const kind = $has('.sidebar-labels .label[title="bug"]', doc) ? 'bug' : 'feature';
      const tickets = [{ id, title, kind }];
      return fn(null, tickets);
    }

    return fn(null, null);
  }
};

export default adapter;
