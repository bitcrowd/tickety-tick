import * as helpers from './helpers';

describe('format helpers', () => {
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
