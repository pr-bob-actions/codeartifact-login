import { common } from "./common";
import { cleanCodeArtifact } from "./lib/configure";

async function clean() {
  const config = common();

  cleanCodeArtifact(config);
}

clean().catch((e) => {
  console.log("Error occurred");
  e && console.log(e);
  process.exit;
});
