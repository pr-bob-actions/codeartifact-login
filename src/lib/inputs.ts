import { error, info, warning } from "@actions/core";
import {
  AwsCreds,
  Config,
  Context,
  Inputs,
  PackageManager,
  Registry,
} from "./types";

export function parseInputs(): Inputs {
  return {
    packageManager: process.env["INPUT_PACKAGE-MANAGER"],
    arn: process.env["INPUT_ARN"],
    context: process.env["INPUT_CONTEXT"],
    aws: {
      accessKeyId: process.env["INPUT_AWS-ACCESS-KEY-ID"],
      secretAccessKey: process.env["INPUT_AWS-SECRET-ACCESS-KEY"],
      sessionToken: process.env["INPUT_AWS-SESSION-TOKEN"],
    },
    duration: process.env["INPUT_DURATION"],
  };
}

export function validateInputs(inputs: Inputs): Config {
  const { arn, context, packageManager, aws, duration } = inputs;

  return {
    packageManager: validatePackageManager(packageManager),
    registry: validateARN(arn),
    context: validateContext(context),
    aws: validateAwsCreds(aws),
    duration: validateDuration(duration),
  };
}

export function validatePackageManager(
  packageManager?: string
): PackageManager {
  if (!packageManager) {
    info("No package manager set, fallback to yarn");
    return "yarn";
  }

  let validPackageManager: PackageManager;

  switch (packageManager.toLowerCase()) {
    case "yarn":
      validPackageManager = "yarn";
      break;
    case "npm":
      validPackageManager = "npm";
      break;
    default:
      throw error(
        `Wrong input, ${packageManager} is not a valid value for package_manager`,
        { title: "Wrong input: package manager" }
      );
  }

  return validPackageManager;
}

export function validateARN(arn?: string): Registry {
  if (!arn) {
    throw error("ARN Must be specified", { title: "Missing input: ARN" });
  }

  const [_arn, _aws, service, region, owner, repository] = arn.split(":");
  const [resourceType, domain, name] = repository?.split("/") ?? [];

  if (_arn.toLowerCase() != "arn" || _aws.toLowerCase() != "aws") {
    throw error("This is not an AWS ARN Code", { title: "Bad input: ARN" });
  }

  if (service.toLowerCase() != "codeartifact") {
    throw (
      (error("This is not a Codeartifact ARN"), { title: "Bad input: ARN" })
    );
  }

  if (resourceType.toLowerCase() != "repository") {
    throw error("This ARN do not relate to a codeartifact repository", {
      title: "Bad input: ARN",
    });
  }

  info(`Using Codeartifact ARN: ${arn}`);

  return {
    region,
    owner,
    domain,
    repository: name,
  };
}

export function validateContext(context?: string): Context {
  let validContext: Context;

  switch (context?.toLowerCase()) {
    case "local":
      validContext = "local";
      break;
    case undefined:
    case "":
      info("No context set, fallback to 'global'");
    case "global":
      validContext = "global";
      break;
    default:
      throw error(`Wrong value for input context: ${context}`, {
        title: "Bad input: Context",
      });
  }

  info(`Using context: ${validContext}`);

  return validContext;
}

export function validateAwsCreds(aws?: Inputs["aws"]): AwsCreds | undefined {
  if (!aws) {
    info("No AWS creds found");
    return undefined;
  }

  const { accessKeyId, secretAccessKey, sessionToken } = aws;

  if (!accessKeyId && !secretAccessKey && !sessionToken) {
    info("No AWS creds found");
    return undefined;
  }

  if (!accessKeyId) {
    warning(
      "AWS Creds found but missing aws_access_key_id. Do not use AWS Creds"
    );
    return undefined;
  }

  if (!secretAccessKey) {
    warning(
      "AWS Creds found but missing aws_secret_access_key. Do not use AWS Creds"
    );
    return undefined;
  }

  return {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    sessionToken: sessionToken,
  };
}

export function validateDuration(duration?: string): number {
  const MIN_DURATION = 15 * 60; // 15 minutes (900 seconds)
  if (!duration) {
    warning(`No duration set, use min duration: ${MIN_DURATION}s`);
    return MIN_DURATION;
  }

  const regexp = /(?<base>\d+)(?<unit>s|m|h|min)?/i;

  const match = duration.match(regexp);

  if (!match) {
    throw error(`Duration: invalid value: ${duration}`, {
      title: "Wrong input",
    });
  }

  const base = parseInt(match.groups?.base ?? "");
  const unit = match.groups?.unit;

  if (isNaN(base) || base < 0) {
    throw error(`Duration, invalid value: ${duration}`, {
      title: "Wrong input",
    });
  }

  let validDuration: number;

  switch (unit?.toLowerCase()) {
    case undefined:
      warning("No unit for duration, use seconds");
    case "s":
      validDuration = base;
      break;
    case "m":
    case "min":
      validDuration = base * 60;
      break;
    case "h":
      validDuration = base * 60 * 60;
      break;
    default:
      throw error(`Duration: Invalid unit: ${unit}`, { title: "Wrong input" });
  }

  if (validDuration < MIN_DURATION) {
    warning(`Too low duration, use min duration: ${MIN_DURATION}s`);
    return MIN_DURATION;
  }

  info(`Use duration: ${validDuration}`);

  return validDuration;
}
