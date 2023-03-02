# Login to Codeartifact for Github Actions

This action ask the AWS's API for a codeartifact token then set this token in the appropriate config file (yarnrc, npmrc, ...)

## Inputs

- `arn`: the codeartifact repository ARN (required)
- `package-manager`: `yarn`(default) or `npm`
- `context`: `global` (default) or `local`
- `duration`: the validity duration of the token

The duration can be defined with value and unit, example:

- `30m` (30 minutes)
- `2000s` (2000 seconds)
- `3h` (3 hours)

> if the unit is omitted the action assume this is second

AWS credentials (optional):

- `aws-access-key-id`
- `aws-secret-access-key`
- `aws-session-token`

AWS credentials can be set in a previous step or passed to the action. If credentials are passed, previously set credentials are ignored

At least the `access_key_id` and `secret_access_key` must be set

## Outputs

- `token`: the token

### Context

With `global` context, the action update the User config file (`$HOME/<rc-file>`). With `local` context the action update the config file located at the project root

## Clean

At the end of the jobs, the token is removed from the config file
