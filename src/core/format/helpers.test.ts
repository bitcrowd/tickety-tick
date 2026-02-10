import * as helpers from "./helpers";

describe("format helpers", () => {
  describe("lowercase", () => {
    const lowercase = helpers.lowercase();

    it("lowercases strings", () => {
      expect(lowercase("QUIET")).toBe("quiet");
    });
  });

  describe("map", () => {
    it("maps values using an object", () => {
      const map = helpers.map({ a: "b" });
      expect(map("a")).toBe("b");
    });

    it("returns the original value if key is not found in object", () => {
      const map = helpers.map({ a: "b" });
      expect(map("c")).toBe("c");
    });

    it("maps values using pairs", () => {
      const map = helpers.map("a", "b", "c", "d");
      expect(map("a")).toBe("b");
      expect(map("c")).toBe("d");
    });

    it("returns the original value if key is not found in pairs", () => {
      const map = helpers.map("a", "b");
      expect(map("c")).toBe("c");
    });
  });

  describe("shellquote", () => {
    const shellquote = helpers.shellquote();

    it("wraps the input in single-quotes", () => {
      expect(shellquote('echo "pwned"')).toBe("'echo \"pwned\"'");
    });

    it("escapes any single-quotes in the input", () => {
      const input = "you'; echo aren't \"pwned\"";
      const quoted = "'you'\\''; echo aren'\\''t \"pwned\"'";
      expect(shellquote(input)).toBe(quoted);
    });
  });

  describe("slugify", () => {
    const slugify = helpers.slugify();

    it("formats normal strings", () => {
      const formatted = slugify("hello");
      expect(formatted).toBe("hello");
    });

    it("lowercases strings", () => {
      const formatted = slugify("Bitcrowd");
      expect(formatted).toBe("bitcrowd");
    });

    it("formats spaces to dashes", () => {
      const formatted = slugify("hello bitcrowd");
      expect(formatted).toBe("hello-bitcrowd");
    });

    it("formats special characters", () => {
      const formatted = slugify("Señor Dévèloper");
      expect(formatted).toBe("senor-developer");
    });

    it("formats umlauts", () => {
      const formatted = slugify("äöüß");
      expect(formatted).toBe("aeoeuess");
    });

    it("strips brackets", () => {
      const formatted = slugify("[#23] Add (more)");
      expect(formatted).toBe("23-add-more");
    });

    it("formats slashes to dashes", () => {
      const formatted = slugify("src/js/format");
      expect(formatted).toBe("src-js-format");
    });

    it("formats dots to dashes", () => {
      const formatted = slugify("format.js");
      expect(formatted).toBe("format-js");
    });

    it("strips hashes", () => {
      const formatted = slugify("##23 #hashtag");
      expect(formatted).toBe("23-hashtag");
    });

    it("accepts a custom separator", () => {
      const formatted = helpers.slugify("_")("##23 #hashtag");
      expect(formatted).toBe("23_hashtag");
    });
  });

  describe("substring", () => {
    const substring = helpers.substring(3, 6);

    it("returns the specified slice of a string", () => {
      expect(substring("abcdefghi")).toBe("def");
    });
  });

  describe("trim", () => {
    const trim = helpers.trim();

    it("removes leading and trailing whitespace", () => {
      expect(trim("\t  black\t\t  ")).toBe("black");
    });
  });

  describe("truncate", () => {
    const truncate = helpers.truncate(3);

    it("truncates strings longer than the limit", () => {
      expect(truncate("abcd")).toBe("ab…");
    });

    it("returns short strings unchanged", () => {
      expect(truncate("abc")).toBe("abc");
    });
  });

  describe("uppercase", () => {
    const uppercase = helpers.uppercase();

    it("uppercases strings", () => {
      expect(uppercase("loud")).toBe("LOUD");
    });
  });
});
