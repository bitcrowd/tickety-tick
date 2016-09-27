import format from '../../src/common/popup/utils/format.js';

describe('format util', () => {
  const ticket = {
    id: 'BTC-042',
    title: 'Weird Bug while eating cake',
    type: 'bug'
  };

  describe('commit', () => {
    it('formats', () => {
      const formatted = format.commit(ticket);
      expect(formatted).toBe(`[#${ticket.id}] ${ticket.title}`);
    });
  });

  describe('branch', () => {
    it('formats', () => {
      const formatted = format.branch(ticket);
      expect(formatted).toBe(`${ticket.type || 'feature'}/${ticket.id}-${format.normalize(ticket.title)}`);
    });

    it('formats type to feature if not provided', () => {
      const miniTicket = {
        id: ticket.id,
        title: ticket.title
      };
      const formatted = format.branch(miniTicket);
      expect(formatted).toBe(`feature/${ticket.id}-${format.normalize(ticket.title)}`);
    });
  });

  describe('normalize', () => {
    it('formats normal string', () => {
      const formatted = format.normalize('hello');
      expect(formatted).toBe('hello');
    });

    it('de-capitalizes', () => {
      const formatted = format.normalize('Bitcrowd');
      expect(formatted).toBe('bitcrowd');
    });

    it('formats a string with a space', () => {
      const formatted = format.normalize('hello bitcrowd');
      expect(formatted).toBe('hello-bitcrowd');
    });
  });

});

