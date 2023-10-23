import * as filters from "./filters";

describe("filters", () => {
  describe("shellquote", () => {
    const { shellquote } = filters;

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
    const { slugify } = filters;

    it("formats normal strings", () => {
      expect(slugify("hello")).toBe("hello");
    });

    it("lowercases strings", () => {
      expect(slugify("Bitcrowd")).toBe("bitcrowd");
    });

    it("formats spaces to dashes", () => {
      expect(slugify("hello bitcrowd")).toBe("hello-bitcrowd");
    });

    it("formats special characters", () => {
      expect(slugify("Señor Dévèloper")).toBe("senor-developer");
    });

    it("formats umlauts", () => {
      expect(slugify("äöüß")).toBe("aeoeuess");
    });

    it("strips brackets", () => {
      expect(slugify("[#23] Add (more)")).toBe("23-add-more");
    });

    it("formats slashes to dashes", () => {
      expect(slugify("src/js/format")).toBe("src-js-format");
    });

    it("formats dots to dashes", () => {
      expect(slugify("format.js")).toBe("format-js");
    });

    it("strips hashes", () => {
      expect(slugify("##23 #hashtag")).toBe("23-hashtag");
    });

    it("accepts a custom separator", () => {
      expect(slugify("##23 #hashtag", "_")).toBe("23_hashtag");
    });
  });

  describe("substring", () => {
    const { substring } = filters;

    it("returns the specified slice of a string", () => {
      expect(substring("abcdefghi", 3, 6)).toBe("def");
    });
  });
});
