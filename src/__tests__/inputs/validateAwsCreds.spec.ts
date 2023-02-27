import { validateAwsCreds } from "../../lib/inputs";

const defaultInputs: any = {
  accessKeyId: "ID",
  secretAccessKey: "KEY",
  sessionToken: "TOKEN",
};

describe("ValidateAwsCreds", () => {
  test("No Creds - should return undefined", () => {
    const creds = validateAwsCreds();

    expect(creds).toBeUndefined();
  });

  test("All values undefined - should return undefined", () => {
    const creds = validateAwsCreds({
      accessKeyId: undefined,
      secretAccessKey: undefined,
      sessionToken: undefined,
    });

    expect(creds).toBeUndefined();
  });

  test("Missing AccessKeyId - should return undefined", () => {
    const inputs = { ...defaultInputs };
    delete inputs.accessKeyId;

    const creds = validateAwsCreds(inputs);

    expect(creds).toBeUndefined();
  });

  test("Missing SecretAccessKey - should return undefined", () => {
    const inputs = { ...defaultInputs };
    delete inputs.secretAccessKey;

    const creds = validateAwsCreds(inputs);

    expect(creds).toBeUndefined();
  });

  test("Missing SessionToken - should return creds without token", () => {
    const inputs = { ...defaultInputs };
    delete inputs.sessionToken;

    const creds = validateAwsCreds(inputs);

    expect(creds).toBeDefined();
    expect(creds?.accessKeyId).toBe(defaultInputs.accessKeyId);
    expect(creds?.secretAccessKey).toBe(defaultInputs.secretAccessKey);
  });

  test("Complete creds - should return creds", () => {
    const inputs = { ...defaultInputs };

    const creds = validateAwsCreds(inputs);

    expect(creds).toBeDefined();
    expect(creds?.accessKeyId).toBe(defaultInputs.accessKeyId);
    expect(creds?.secretAccessKey).toBe(defaultInputs.secretAccessKey);
    expect(creds?.sessionToken).toBe(defaultInputs.sessionToken);
  });
});
