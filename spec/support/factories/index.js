/* eslint-disable import/prefer-default-export */

export const ticket = (overrides = {}) => {
  const defaults = { id: '1', title: 'ticket title', type: 'feature' };

  const base = { ...defaults, ...overrides };

  const branch = `branch-${base.id}`;
  const commit = `commit-${base.id}`;
  const command = `command-${base.id}`;

  const fmt = { branch, commit, command };

  return { ...base, fmt };
};
