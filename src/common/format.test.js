import format, { helpers } from './format';

describe('ticket formatting', () => {
  const ticket = {
    id: 'BTC-042',
    title: 'Add more tests for src/common/format.js',
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

  describe('helpers', () => {
    describe('lowercase', () => {
      const { lowercase } = helpers;

      it('lowercases strings', () => {
        expect(lowercase('QUIET')).toBe('quiet');
      });
    });

    describe('shellquote', () => {
      const { shellquote } = helpers;

      it('wraps the input in single-quotes', () => {
        expect(shellquote('echo "pwned"')).toBe('\'echo "pwned"\'');
      });

      it('escapes any single-quotes in the input', () => {
        const input = 'you\'; echo aren\'t "pwned"';
        const quoted = '\'you\'\\\'\'; echo aren\'\\\'\'t "pwned"\'';
        expect(shellquote(input)).toBe(quoted);
      });
    });

    describe('slugify', () => {
      const { slugify } = helpers;

      it('formats normal strings', () => {
        const formatted = slugify('hello');
        expect(formatted).toBe('hello');
      });

      it('lowercases strings', () => {
        const formatted = slugify('Bitcrowd');
        expect(formatted).toBe('bitcrowd');
      });

      it('formats spaces to dashes', () => {
        const formatted = slugify('hello bitcrowd');
        expect(formatted).toBe('hello-bitcrowd');
      });

      it('formats special characters', () => {
        const formatted = slugify('Señor Dévèloper');
        expect(formatted).toBe('senor-developer');
      });

      it('formats umlauts', () => {
        const formatted = slugify('äöüß');
        expect(formatted).toBe('aeoeuess');
      });

      it('strips brackets', () => {
        const formatted = slugify('[#23] Add (more)');
        expect(formatted).toBe('23-add-more');
      });

      it('formats slashes to dashes', () => {
        const formatted = slugify('src/js/format');
        expect(formatted).toBe('src-js-format');
      });

      it('formats dots to dashes', () => {
        const formatted = slugify('format.js');
        expect(formatted).toBe('format-js');
      });

      it('strips hashes', () => {
        const formatted = slugify('##23 #hashtag');
        expect(formatted).toBe('23-hashtag');
      });
    });

    describe('trim', () => {
      const { trim } = helpers;

      it('removes leading and trailing whitespace', () => {
        expect(trim('\t  black\t\t  ')).toBe('black');
      });
    });

    describe('uppercase', () => {
      const { uppercase } = helpers;

      it('uppercases strings', () => {
        expect(uppercase('loud')).toBe('LOUD');
      });
    });
  });
});
