import markdown from 'prettier/parser-markdown';
import prettier from 'prettier/standalone';
import unindent from 'strip-indent';

const widths = { subject: 50, body: 72 };

const config = { parser: 'markdown', plugins: [markdown] };

function format(text, width) {
  const options = { ...config, printWidth: width, proseWrap: 'always' };
  return prettier.format(text, options);
}

function split(string, separator) {
  const position = string.indexOf(separator);

  if (position < 0) return [string];

  const head = string.substring(0, position);
  const tail = string.substring(position + separator.length);

  return [head, tail];
}

function capitalize(string) {
  return string.replace(/^[a-zA-Z]|\s[a-zA-Z]/, (w) => w.toUpperCase());
}

function gitsubject(string) {
  const subject = capitalize(string.trim());

  if (subject.length > widths.subject) {
    const [start, rest] = split(format(subject, widths.subject - 1), '\n');
    return [`${start}…`, format(`…${rest}`, widths.body)].join('\n\n');
  }

  return subject;
}

function gitbody(string) {
  const body = unindent(string.replace(/^(\s*\n)*|\s*$/, ''));
  return format(body, widths.body);
}

function maybe(value, fn) {
  if (typeof value !== 'string') return value;
  return fn(value);
}

function print(input) {
  const [line0, rest] = split(input.trim(), '\n');
  const parts = [maybe(line0, gitsubject), maybe(rest, gitbody)];
  return parts.filter(Boolean).join('\n\n');
}

export default print;
