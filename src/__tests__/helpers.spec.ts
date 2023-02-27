import { buildRegistryUri } from "../lib/helpers";
import { Registry } from "../lib/types";

describe("Helpers", () => {
  describe("buildRegistryUri", () => {
    const registry: Registry = {
      domain: "my-domain",
      owner: "123456791011",
      region: "eu-wst-3",
      repository: "my-repository",
    };

    test("Npm format", () => {
      const uri = buildRegistryUri(registry, "npm");

      const regexp = new RegExp(
        `${registry.domain}-${registry.owner}.d.codeartifact.${registry.region}.amazonaws.com/npm/${registry.repository}`
      );

      expect(uri).toMatch(regexp);
    });

    test("Pypi format", () => {
      const uri = buildRegistryUri(registry, "pypi");

      const regexp = new RegExp(
        `${registry.domain}-${registry.owner}.d.codeartifact.${registry.region}.amazonaws.com/pypi/${registry.repository}`
      );

      expect(uri).toMatch(regexp);
    });
  });
});
