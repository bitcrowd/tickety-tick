import format, { helpers } from '.';
import pprint from './pretty-print';

jest.mock('./pretty-print', () => jest.fn());

describe('ticket formatting', () => {
  const ticket = {
    id: 'BTC-042',
    title: 'Add more tests for src/common/format/index.js',
    type: 'new enhancement',
  };

  beforeEach(() => {
    pprint.mockClear();
  });

  describe('default format', () => {
    const fmt = format({}, false);

    describe('commit', () => {
      it('includes ticket id and title', () => {
        const formatted = fmt.commit(ticket);
        expect(formatted).toBe(`[#${ticket.id}] ${ticket.title}`);
      });
    });

    describe('branch', () => {
      const slugify = helpers.slugify();

      it('includes ticket type, id and title', () => {
        const formatted = fmt.branch(ticket);
        expect(formatted).toBe(
          `${slugify(ticket.type)}/${slugify(ticket.id)}-${slugify(
            ticket.title
          )}`
        );
      });

      it('formats type to "feature" if not provided', () => {
        const typeless = { id: ticket.id, title: ticket.title };
        const formatted = fmt.branch(typeless);
        expect(formatted).toBe(
          `feature/${slugify(ticket.id)}-${slugify(ticket.title)}`
        );
      });
    });

    describe('command', () => {
      const shellquote = helpers.shellquote();

      it('includes the quoted branch name and commit message', () => {
        const branch = fmt.branch(ticket);
        const commit = fmt.commit(ticket);

        const formatted = fmt.command(ticket);

        expect(formatted).toBe(
          `git checkout -b ${shellquote(branch)}` +
            ` && git commit --allow-empty -m ${shellquote(commit)}`
        );
      });
    });
  });

  describe('with pretty-printing enabled', () => {
    const stdfmt = format({}, false);
    const fmt = format({}, true);

    describe('commit', () => {
      it('is pretty-printed', () => {
        pprint.mockReturnValue('pretty-printed commit');
        const original = stdfmt.commit(ticket);
        const formatted = fmt.commit(ticket);
        expect(pprint).toHaveBeenCalledWith(original);
        expect(formatted).toBe('pretty-printed commit');
      });
    });
  });
});
