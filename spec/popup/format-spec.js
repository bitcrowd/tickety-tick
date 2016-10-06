import format from '../../src/common/popup/utils/format.js';

describe('format util', () => {
  const ticket = {
    id: 'BTC-042',
    title: 'Add more tests for src/common/popup/utils/format.js',
    type: 'bug'
  };

  describe('commit', () => {
    it('includes ticket id and title', () => {
      const formatted = format.commit(ticket);
      expect(formatted).toBe(`[#${ticket.id}] ${ticket.title}`);
    });
  });

  describe('branch', () => {
    it('includes ticket type, id and title', () => {
      const formatted = format.branch(ticket);
      expect(formatted)
        .toBe(`${ticket.type}/${ticket.id}-${format.normalize(ticket.title)}`);
    });

    it('formats type to feature if not provided', () => {
      const typeless = {
        id: ticket.id,
        title: ticket.title
      };
      const formatted = format.branch(typeless);
      expect(formatted).toBe(`feature/${ticket.id}-${format.normalize(ticket.title)}`);
    });
  });

  describe('command', () => {
    it('includes branch anme and commit message', () => {
      const formatted = format.command(ticket);
      expect(formatted).toBe(`git checkout -b ${format.branch(ticket)} && git commit --allow-empty -m "${format.commit(ticket)}"`);
    });
  });

  describe('normalize', () => {
    it('formats normal strings', () => {
      const formatted = format.normalize('hello');
      expect(formatted).toBe('hello');
    });

    it('lowercases strings', () => {
      const formatted = format.normalize('Bitcrowd');
      expect(formatted).toBe('bitcrowd');
    });

    it('formats spaces to dashes', () => {
      const formatted = format.normalize('hello bitcrowd');
      expect(formatted).toBe('hello-bitcrowd');
    });

    it('formats special characters', () => {
      const formatted = format.normalize('Señor Dévèloper');
      expect(formatted).toBe('senor-developer');
    });

    it('formats umlauts', () => {
      const formatted = format.normalize('äöüß');
      expect(formatted).toBe('aeoeuess');
    });

    it('strips brackets', () => {
      const formatted = format.normalize('[#23] Add (more)');
      expect(formatted).toBe('23-add-more');
    });

    it('formats slashes to dashes', () => {
      const formatted = format.normalize('src/js/format');
      expect(formatted).toBe('src-js-format');
    });

    it('formats dots to dashes', () => {
      const formatted = format.normalize('format.js');
      expect(formatted).toBe('format-js');
    });

    it('strips hashes', () => {
      const formatted = format.normalize('##23 #hashtag');
      expect(formatted).toBe('23-hashtag');
    });
  });
});
