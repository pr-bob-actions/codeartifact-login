import { error } from "@actions/core";
import {
  CodeartifactClient,
  GetAuthorizationTokenCommand,
  CodeartifactClientConfig,
} from "@aws-sdk/client-codeartifact";
import { AwsCreds, Registry } from "./types";

export async function fetchToken(
  registry: Registry,
  duration: number,
  creds?: AwsCreds
): Promise<string> {
  let credentials: CodeartifactClientConfig["credentials"] | undefined =
    undefined;

  if (creds) {
    credentials = {
      accessKeyId: creds.accessKeyId,
      secretAccessKey: creds.secretAccessKey,
      sessionToken: creds.sessionToken,
    };
  }

  const client = new CodeartifactClient({
    region: registry.region,
    credentials,
  });

  const cmd = new GetAuthorizationTokenCommand({
    domain: registry.domain,
    domainOwner: registry.owner,
    durationSeconds: duration,
  });

  const result = await client.send(cmd);

  const { authorizationToken } = result;

  if (!authorizationToken) {
    throw error("No token returned from AWS");
  }

  return authorizationToken;
}
