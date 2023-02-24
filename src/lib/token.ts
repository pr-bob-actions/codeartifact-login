import { error } from "@actions/core";
import {
  CodeartifactClient,
  GetAuthorizationTokenCommand,
} from "@aws-sdk/client-codeartifact";
import { AwsCreds, Registry } from "./types";

export async function fetchToken(
  registry: Registry,
  duration: number,
  creds?: AwsCreds
): Promise<string> {
  const client = new CodeartifactClient({ region: registry.region });
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
