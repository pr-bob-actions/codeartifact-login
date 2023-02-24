import { parseInputs, validateInputs } from "./lib/inputs";

export function common() {
  const inputs = parseInputs();
  const config = validateInputs(inputs);

  return config;
}
