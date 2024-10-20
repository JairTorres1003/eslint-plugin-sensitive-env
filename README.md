# eslint-plugin-sensitive-env

An ESLint plugin designed to prevent hardcoded sensitive values in your code. This plugin ensures that all sensitive values, such as API keys, tokens, passwords, and other environment-specific data, are stored in environment variables instead of being hardcoded into the source code.

## Features

- Detects hardcoded sensitive values based on predefined or custom environment variable identifiers.
- Supports `.env` files to define environment variables.
- Allows configuration of environment files and sensitive value identifiers.
- Ignores specific identifiers when configured.

## Installation

To install the plugin, run the following command:

```bash
npm install eslint-plugin-sensitive-env --save-dev
```

or using `yarn`:

```bash
yarn add eslint-plugin-sensitive-env --dev
```

## Usage

Add the plugin to your ESLint configuration:

```json
{
  "plugins": ["sensitive-env"],
  "rules": {
    "sensitive-env/no-hardcoded-values": "error"
  }
}
```

### Rule Options

The `no-hardcoded-values` rule provides flexible configuration options:

- `envFile` (optional): The path to the environment file where sensitive values are stored.

  - If no file is provided, the plugin will search for one of the following files:
    ```json
    [
      ".env.production",
      ".env.development",
      ".env.local",
      ".env",
      ".env.local.example",
      ".env.example"
    ]
    ```

- `identifiers` (optional): An array of uppercase strings representing parts of environment variable names that are considered sensitive.

  - Defaults to:
    ```json
    ["API", "URL", "TOKEN", "PASSWORD", "SECRET", "UUID", "KEY", "DOMAIN"]
    ```
  - If set to an empty array (`[]`), all environment variables will be treated as sensitive.

- `ignore` (optional): An array of identifiers to ignore during the check.

  - If defined, the identifiers option will not be used.

### Example Configuration

```json
{
  "rules": {
    "sensitive-env/no-hardcoded-values": [
      "error",
      {
        "envFile": ".env",
        "identifiers": ["TOKEN", "SECRET"]
      }
    ]
  }
}
```

In this configuration:

- .env is used as the environment file.
- The rule will flag any hardcoded value containing TOKEN or SECRET.

## Rule Details

The `no-hardcoded-values` rule checks for sensitive values that should be stored in environment variables instead of being hardcoded. It works by reading an environment file (e.g., `.env`) and matching values defined by the specified `identifiers`.

If the environment file does not exist or cannot be found, the rule will produce a warning with the message:

```
The environment file <envFile> does not exist.
```

If a hardcoded sensitive value is found, the following error message will be reported:

```
Do not hardcode sensitive values. Use environment variables instead.
```

### Identifiers

The `identifiers` array is used to specify which parts of an environment variable name should be considered sensitive. For example, if your `.env` file contains the following variables:

```bash
PUBLIC_API_KEY=yourApiKey
PUBLIC_SECRET_TOKEN=yourSecretToken
PUBLIC_URL_API=http://yourDomain/
PUBLIC_PASSWORD=yourPassword
```

And you configure the rule to use `["API_KEY", "TOKEN", "URL"]` as identifiers, the rule will flag any hardcoded use of `yourApiKey`, `yourSecretToken` or `yourDomain`.

## Customization

You can customize the behavior of the plugin by defining your own set of identifiers or ignoring specific ones. This allows flexibility to adapt the plugin to different project setups and avoid unnecessary false positives.

### Example: Custom Identifiers

```json
{
  "rules": {
    "sensitive-env/no-hardcoded-values": [
      "error",
      {
        "identifiers": ["PASSWORD", "SECRET", "DOMAIN"]
      }
    ]
  }
}
```

In this case, only values containing `PASSWORD`, `SECRET`, or `DOMAIN` will be considered sensitive.

### Example: Ignoring Identifiers

```json
{
  "rules": {
    "sensitive-env/no-hardcoded-values": [
      "error",
      {
        "ignore": ["UUID"]
      }
    ]
  }
}
```

In this case, the rule will ignore any sensitive value related to `UUID`, and only other identifiers will be checked.

## Testing

To run the tests for this plugin:

```bash
npm test
```

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out [the issues page](https://github.com/JairTorres1003/eslint-plugin-sensitive-env/issues) if you have suggestions or encounter problems.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
