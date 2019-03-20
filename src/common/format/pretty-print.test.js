import print from './pretty-print';

describe('pretty-print', () => {
  it('capitalizes subject lines', () => {
    expect(print('apply proper casing')).toBe('Apply proper casing');
    expect(print('[#42] capitalize subject')).toBe('[#42] Capitalize subject');
  });

  it('wraps overlong subject lines', () => {
    const input = 'Wrap commit subject lines with more than 50 characters and insert one blank line before the remaining subject text. Wrap the remaining subject text to 72 characters.';
    expect(print(input)).toMatchSnapshot();
  });

  it('wraps overlong body lines', () => {
    const input = `Wrap body lines

More detailed explanatory text is wrapped to 72 characters. The blank line separating the subject from the body is critical unless you omit the body entirely.
    `;

    expect(print(input)).toMatchSnapshot();
  });

  it('formats lists', () => {
    const input = `Format lists in body

* Bullet points are okay too
* Typically a hyphen or asterisk is used for the bullet, followed by a
single space, with blank lines in between, but conventions vary here
* Use a hanging indent
    `;

    expect(print(input)).toMatchSnapshot();
  });

  it('strips leading and trailing blank lines and whitespace', () => {
    const input = `

  Remove whitespace around subject line  


Also, remove additional blank lines before and after body.

Preserve blank lines between paragraphs of the body.
  
Strip whitespace on empty lines (see line above).

Strip trailing whitespace (see end of this line).  

    `;

    expect(print(input)).toMatchSnapshot();
  });

  it('strips body indentation', () => {
    const input = `Strip body indentation

      Unindent this line.
      Move this one up.

          function leave(me) {
            return 'indented';
          }

      And continue.
    `;

    expect(print(input)).toMatchSnapshot();
  });
});
