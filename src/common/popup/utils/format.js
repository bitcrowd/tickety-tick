import { createSlug } from 'speakingurl';

const slugify = createSlug({ separator: '-' });

const format = {};

format.shellquote = function shellquote(s) {
  if (typeof s === 'string') return `'${s.replace(/'/g, '\'\\\'\'')}'`;
  return '\'\'';
};

format.normalize = function normalize(s) {
  return slugify(s);
};

format.commit = function commit(ticket) {
  return `[#${ticket.id}] ${ticket.title}`;
};

format.branch = function branch(ticket) {
  return `${ticket.type || 'feature'}/${ticket.id}-${format.normalize(ticket.title)}`;
};

format.command = function command(ticket) {
  const branchname = format.shellquote(format.branch(ticket));
  const message = format.shellquote(format.commit(ticket));
  return `git checkout -b ${branchname} && git commit --allow-empty -m ${message}`;
};

export default format;
