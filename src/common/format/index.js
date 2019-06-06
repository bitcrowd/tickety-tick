import compile from './template';
import * as defaults from './defaults';
import * as helpers from './helpers';
import pprint from './pretty-print';

export { defaults };
export { helpers };

const fallbacks = {
  type: 'feature',
};

const renderer = (templates, name) => {
  const render = compile(templates[name] || defaults[name], helpers);
  return values => render({ ...fallbacks, ...values }).trim();
};

export default (templates = {}, prettify = true) => {
  const branch = renderer(templates, 'branch');

  // eslint-disable-next-line no-underscore-dangle
  const _commit = renderer(templates, 'commit');

  const commit = prettify
    ? values => pprint(_commit(values))
    : _commit;

  // eslint-disable-next-line no-underscore-dangle
  const _command = renderer(templates, 'command');

  const command = values => _command({
    branch: branch(values),
    commit: commit(values),
    ...values,
  });

  return { branch, command, commit };
};
