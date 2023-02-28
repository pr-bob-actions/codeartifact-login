import { validatePackageManager } from "../lib/inputs";

describe("ValidatePackageManager", () => {
  test("No package manager - should use yarn", () => {
    const pm = validatePackageManager();

    expect(pm).toBe("yarn");
  });

  test("Empty string - should use yarn", () => {
    const pm = validatePackageManager("");

    expect(pm).toBe("yarn");
  });

  describe("Yarn", () => {
    test.each(["yarn", "YARN", "Yarn", "yArN"])(
      "%s - should use yarn",
      (input) => {
        const pm = validatePackageManager(input);

        expect(pm).toBe("yarn");
      }
    );
  });

  describe("Npm", () => {
    test.each(["npm", "NPM", "Npm", "nPm"])("%s - should use npm", (input) => {
      const pm = validatePackageManager(input);

      expect(pm).toBe("npm");
    });
  });

  describe("Other value - should throw", () => {
    test.each(["pypi", "hello", "maven", "pnpm"])(
      "%s - should throw",
      (input) => {
        expect(() => validatePackageManager(input)).toThrow();
      }
    );
  });
});
