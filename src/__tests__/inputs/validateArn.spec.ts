import { validateARN } from "../../lib/inputs";

describe("ValidateARN", () => {
  test("No ARN - should throw", () => {
    expect(() => validateARN()).toThrow();
  });

  test("Empty string - should throw", () => {
    expect(() => validateARN("")).toThrow();
  });

  test("Valid ARN", () => {
    const registry = validateARN(
      "arn:aws:codeartifact:eu-west-3:291845142233:repository/professorbob-ai/npm.registery.profressorbob"
    );

    expect(registry.domain).toBe("professorbob-ai");
    expect(registry.owner).toBe("291845142233");
    expect(registry.region).toBe("eu-west-3");
    expect(registry.repository).toBe("npm.registery.profressorbob");
  });
});
