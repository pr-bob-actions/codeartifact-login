import { Format, Registry } from "./types";

export function buildRegistryUri(registry: Registry, format: Format): string {
  return `//${registry.domain}-${registry.owner}.d.codeartifact.${registry.region}.amazonaws.com/${format}/${registry.repository}/`;
}
