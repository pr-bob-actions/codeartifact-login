export type Format = "npm" | "pypi";
export type Context = "local" | "global";
export type PackageManager = "yarn" | "npm"; // pypi ??
export interface Inputs {
  packageManager?: string;
  arn?: string;
  context?: string;
  duration?: string;
  aws: {
    accessKeyId?: string;
    secretAccessKey?: string;
    sessionToken?: string;
  };
}

export interface Config {
  packageManager: PackageManager;
  registry: Registry;
  context: Context;
  aws?: AwsCreds;
  duration: number;
}

export interface Registry {
  domain: string;
  owner: string;
  region: string;
  repository: string;
}

export interface AwsCreds {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}

export interface VersionSelector {
  versions: string[];
  prerelease?: RegExp;
  match?: RegExp;
}
