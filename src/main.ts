import { setSecret, setOutput } from "@actions/core";
import { common } from "./common";
import { configureCodeArtifact } from "./lib/configure";
import { fetchToken } from "./lib/token";

async function main() {
  const config = common();

  const token = await fetchToken(config.registry, config.duration, config.aws);

  setSecret(token);
  setOutput("token", token);

  configureCodeArtifact(config, token);
}

main().catch((e) => {
  console.log("Error occurred");
  e && console.log(e);
  process.exit;
});
