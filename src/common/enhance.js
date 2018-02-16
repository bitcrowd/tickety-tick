import format from './format';

export default (templates) => {
  const fmt = format(templates);

  const enhance = ticket => ({
    fmt: {
      branch: fmt.branch(ticket),
      commit: fmt.commit(ticket),
      command: fmt.command(ticket),
    },
    ...ticket,
  });

  return enhance;
};
