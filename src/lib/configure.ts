import { error } from "@actions/core";
import { exec } from "./exec";
import { buildRegistryUri } from "./helpers";
import { Config, Context, PackageManager, Registry } from "./types";

export function configureCodeArtifact(config: Config, token: string) {
  switch (config.packageManager) {
    case "npm":
      return configureNpm(config.registry, token, config.context);
    case "yarn":
      return configureYarn(config.registry, token, config.context);
    default:
      throw error(`Package manager ${config.packageManager} not implemented`, {
        title: "Code not implemented",
      });
  }
}

export function cleanCodeArtifact(config: Config) {
  switch (config.packageManager) {
    case "npm":
      return cleanNpm(config.registry, config.context);
    case "yarn":
      return cleanYarn(config.registry, config.context);
    default:
      throw error(`Package manager ${config.packageManager} not implemented`, {
        title: "Code not implemented",
      });
  }
}

function configureYarn(registry: Registry, token: string, context: Context) {
  const url = "https:" + buildRegistryUri(registry, "npm");

  const base = ["yarn", "config", "set"];

  if (context == "global") {
    base.push("-H");
  }

  exec([...base, `'npmRegistries["${url}"].npmAuthToken'`, `"${token}"`]);
  exec([...base, `'npmRegistries["${url}"].npmAlwaysAuth'`, "true"]);
}

function cleanYarn(registry: Registry, context: Context) {
  const url = "https:" + buildRegistryUri(registry, "npm");
  const base = ["yarn", "config", "unset"];

  if (context == "global") {
    base.push("-H");
  }

  exec([...base, `'npmRegistries["${url}"]'`]);
}

function configureNpm(registry: Registry, token: string, context: Context) {
  const url = buildRegistryUri(registry, "npm");

  const scope = context == "global" ? "user" : "project";

  exec(["npm", "config", "set", `-L ${scope}`, `${url}:_authToken=${token}`]);
}

function cleanNpm(registry: Registry, context: Context) {
  const url = buildRegistryUri(registry, "npm");

  const scope = context == "global" ? "user" : "project";

  exec(["npm", "config", "delete", `-L ${scope}`, `${url}:_authToken`]);
}
