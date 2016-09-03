// TODO: find a library to normalize non-ascii chars?

function normalize(s) {
  /* eslint-disable quote-props */
  const charmap = {
    'ä': 'ae',
    'ö': 'oe',
    'ü': 'ue',
    'ß': 'ss'
  };
  /* eslint-enable quote-props */

  return s.toLowerCase()
    .replace(/[öäüß]/g, (match) => charmap[match])
    .replace(/[^a-z0-9]/g, '-')
    .replace(/^-/, '')
    .replace(/-$/, '');
}

function commit(ticket) {
  return `[#${ticket.id}] ${ticket.title}`;
}

function branch(ticket) {
  return `${ticket.type || 'feature'}/${normalize(ticket.title)}`;
}

export default {
  normalize,
  commit,
  branch
};
