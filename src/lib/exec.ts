import { execSync } from "child_process";

export function exec(cmd: string | string[]) {
  if (Array.isArray(cmd)) {
    cmd = cmd.join(" ");
  }

  execSync(cmd, { stdio: "ignore", cwd: process.env.INPUT_WORKING_DIR ?? "." });
}
