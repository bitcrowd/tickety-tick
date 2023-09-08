import markdown from "prettier/plugins/markdown";
import prettier from "prettier/standalone";
import unindent from "strip-indent";

const widths = { subject: 50, body: 72 };

function format(text: string, width: number): string {
  return prettier.format(text, {
    parser: "markdown",
    plugins: [markdown],
    printWidth: width,
    proseWrap: "always",
  });
}

function split(text: string, separator: string): [string, string | null] {
  const position = text.indexOf(separator);

  if (position < 0) return [text, null];

  const head = text.substring(0, position);
  const tail = text.substring(position + separator.length);

  return [head, tail];
}

function capitalize(text: string): string {
  return text.replace(/^[a-zA-Z]|\s[a-zA-Z]/, (w) => w.toUpperCase());
}

function gitsubject(text: string): string {
  const subject = capitalize(text.trim());

  if (subject.length > widths.subject) {
    const [start, rest] = split(format(subject, widths.subject - 1), "\n");
    return [`${start}…`, format(`…${rest}`, widths.body)].join("\n\n");
  }

  return subject;
}

function gitbody(text: string): string {
  const body = unindent(text.replace(/^(\s*\n)*|\s*$/, ""));
  return format(body, widths.body);
}

function maybe(
  value: string | null | undefined,
  fn: (text: string) => string,
): string | null | undefined {
  if (typeof value !== "string") return value;
  return fn(value);
}

function print(text: string): string {
  const [line0, rest] = split(text.trim(), "\n");
  const parts = [maybe(line0, gitsubject), maybe(rest, gitbody)];
  return parts
    .filter((v: string | null | undefined) => v !== null)
    .join("\n\n");
}

export default print;
