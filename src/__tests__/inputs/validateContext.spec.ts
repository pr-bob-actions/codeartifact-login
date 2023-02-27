import { validateContext } from "../../lib/inputs";

describe("ValidateContext", () => {
  test("No context - should use global", () => {
    const ctx = validateContext();

    expect(ctx).toBe("global");
  });

  test("Empty string - should use global", () => {
    const ctx = validateContext("");

    expect(ctx).toBe("global");
  });

  describe("Global - case insensitive", () => {
    test.each(["global", "GLOBAL", "gLobAl"])(
      "%s - should use global",
      (input) => {
        const ctx = validateContext(input);

        expect(ctx).toBe("global");
      }
    );
  });

  describe("Local - case insensitive", () => {
    test.each(["local", "LOCAL", "LocAL"])(
      "%s - should use global",
      (input) => {
        const ctx = validateContext(input);

        expect(ctx).toBe("local");
      }
    );
  });

  test("Other value - should throw", () => {
    expect(() => validateContext("hello")).toThrow();
  });
});
