import compile from './template';

describe('template', () => {
  it('replaces any value occurrences', () => {
    const render = compile('{number} => "{word}"');
    const output = render({ number: 12, word: 'dodici' });
    expect(output).toBe('12 => "dodici"');
  });

  it('handles missing values', () => {
    const transforms = { sparkle: s => `*${s}*` };
    const render = compile('--{nope | sparkle}', transforms);
    expect(render({})).toBe('--**');
    expect(render()).toBe('--**');
  });

  it('applies value transformations', () => {
    const lowercase = jest.fn().mockImplementation(s => s.toLowerCase());
    const dasherize = jest.fn().mockImplementation(s => s.replace(/\s+/g, '-'));
    const transforms = { lowercase, dasherize };

    const render = compile('result: {title | lowercase | dasherize}', transforms);
    const output = render({ title: 'A B C' });

    expect(lowercase).toHaveBeenCalledWith('A B C');
    expect(dasherize).toHaveBeenCalledWith('a b c');
    expect(output).toBe('result: a-b-c');
  });

  it('handles missing transformations', () => {
    const render = compile('a{a | ??}', {});
    const output = render({ a: '++' });
    expect(output).toBe('a++');
  });

  it('ignores whitespace within template expressions', () => {
    const transforms = { triple: a => a * 3, square: a => a * a };
    const render = compile('({ a } * 3)**2 = {  a  |  triple  |  square  }', transforms);
    const output = render({ a: 2 });
    expect(output).toBe('(2 * 3)**2 = 36');
  });

  it('handles incomplete template expressions', () => {
    const render = compile('{', {});
    const output = render({});
    expect(output).toBe('{');
  });
});
