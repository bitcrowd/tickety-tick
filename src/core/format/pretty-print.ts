import * as markdown from "prettier/plugins/markdown";
import * as prettier from "prettier/standalone";
import unindent from "strip-indent";

const widths = { subject: 50, body: 72 };

async function format(text: string, width: number): Promise<string> {
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

async function gitsubject(text: string): Promise<string> {
  const subject = capitalize(text.trim());

  if (subject.length > widths.subject) {
    const [start, rest] = split(
      await format(subject, widths.subject - 1),
      "\n",
    );
    return [`${start}…`, await format(`…${rest}`, widths.body)].join("\n\n");
  }

  return subject;
}

async function gitbody(text: string): Promise<string> {
  const body = unindent(text.replace(/^(\s*\n)*|\s*$/, ""));
  return format(body, widths.body);
}

async function maybe(
  value: string | null | undefined,
  fn: (text: string) => Promise<string>,
): Promise<string | null | undefined> {
  if (typeof value !== "string") return value;
  return fn(value);
}

async function print(text: string): Promise<string> {
  const [line0, rest] = split(text.trim(), "\n");
  const parts = [maybe(line0, gitsubject), maybe(rest, gitbody)];
  return (await Promise.all(parts))
    .filter((v: string | null | undefined) => v !== null)
    .join("\n\n");
}

export default print;
