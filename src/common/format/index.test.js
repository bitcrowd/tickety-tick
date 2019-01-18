import format, { helpers } from '.';

describe('ticket formatting', () => {
  const ticket = {
    id: 'BTC-042',
    title: 'Add more tests for src/common/format/index.js',
    type: 'enhancement',
  };

  describe('default format', () => {
    const fmt = format({});

    describe('commit', () => {
      it('includes ticket id and title', () => {
        const formatted = fmt.commit(ticket);
        expect(formatted).toBe(`[#${ticket.id}] ${ticket.title}`);
      });
    });

    describe('branch', () => {
      const { slugify } = helpers;

      it('includes ticket type, id and title', () => {
        const formatted = fmt.branch(ticket);
        expect(formatted).toBe(`${ticket.type}/${slugify(ticket.id)}-${slugify(ticket.title)}`);
      });

      it('formats type to "feature" if not provided', () => {
        const typeless = { id: ticket.id, title: ticket.title };
        const formatted = fmt.branch(typeless);
        expect(formatted).toBe(`feature/${slugify(ticket.id)}-${slugify(ticket.title)}`);
      });
    });

    describe('command', () => {
      const { shellquote } = helpers;

      it('includes the quoted branch name and commit message', () => {
        const branch = fmt.branch(ticket);
        const commit = fmt.commit(ticket);

        const formatted = fmt.command(ticket);

        expect(formatted).toBe(`git checkout -b ${shellquote(branch)}`
          + ` && git commit --allow-empty -m ${shellquote(commit)}`);
      });
    });
  });
});
