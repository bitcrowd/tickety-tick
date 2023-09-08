import compile from "./template";

describe("template", () => {
  it("replaces any value occurrences", () => {
    const render = compile('{number} => "{word}"');
    const output = render({ number: 12, word: "dodici" });
    expect(output).toBe('12 => "dodici"');
  });

  it("handles missing values", () => {
    const transforms = { sparkle: () => (s: string) => `*${s}*` };
    const render = compile("--{nope | sparkle}", transforms);
    expect(render({})).toBe("--**");
    expect(render()).toBe("--**");
  });

  it("applies value transformations", () => {
    const lowercase = jest.fn((s) => s.toLowerCase());
    const dasherize = jest.fn((s) => s.replace(/\s+/g, "-"));

    const transforms = {
      lowercase: () => lowercase,
      dasherize: () => dasherize,
    };

    const render = compile("= {title | lowercase | dasherize}", transforms);
    const output = render({ title: "A B C" });

    expect(lowercase).toHaveBeenCalledWith("A B C");
    expect(dasherize).toHaveBeenCalledWith("a b c");
    expect(output).toBe("= a-b-c");
  });

  it("supports parameterized transformations", () => {
    const long = "abcdefghijklmnopqrstuvwxyz";
    const substring = (start: number, end: number) => (s: string) =>
      s.substring(start, end);
    const transforms = { substring };

    const render = compile("pre {long | substring(15, 18)} post", transforms);
    const output = render({ long });

    expect(output).toBe("pre pqr post");
  });

  it("handles missing transformations", () => {
    const render = compile("a{a | ??}", {});
    const output = render({ a: "++" });
    expect(output).toBe('a!!(no helper named "??")');
  });

  it("handles invalid transformation parameters", () => {
    const int = (s: string): number => Number.parseInt(s, 10);
    const pow = (exp: string) => (s: string) => int(s) ** int(exp);

    const render = compile("{a | pow(break)}", { pow });
    const output = render({ a: 12 });

    expect(output).toBe('!!(invalid parameters provided to "pow": break)');
  });

  it("ignores whitespace within template expressions", () => {
    const transforms = {
      triple: () => (a: number) => a * 3,
      square: () => (a: number) => a * a,
    };

    const render = compile(
      "({ a } * 3)**2 = {  a  |  triple  |  square  }",
      transforms,
    );
    const output = render({ a: 2 });

    expect(output).toBe("(2 * 3)**2 = 36");
  });

  it("handles incomplete template expressions (no closing brace)", () => {
    const render = compile("{", {});
    const output = render({});
    expect(output).toBe("{");
  });

  it("handles incomplete template expressions (incomplete filter pipeline)", () => {
    const trim = () => (s: string) => s.trim();
    const render = compile("{a | trim |}", { trim });
    const output = render({});
    expect(output).toBe('!!(no helper named "undefined")');
  });
});
