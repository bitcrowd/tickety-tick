import format from 'tickety-tick-formatter';

export default (templates, autofmt) => {
  const fmt = format(templates, autofmt);

  const enhance = (ticket) => ({
    fmt: {
      branch: fmt.branch(ticket),
      commit: fmt.commit(ticket),
      command: fmt.command(ticket),
    },
    ...ticket,
  });

  return enhance;
};
