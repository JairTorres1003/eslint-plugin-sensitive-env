# eslint-plugin-sensitive-env [![npm](https://img.shields.io/npm/v/eslint-plugin-sensitive-env)](https://www.npmjs.com/package/eslint-plugin-sensitive-env)

An ESLint plugin designed to prevent hardcoded sensitive values in your code. This plugin ensures that sensitive values, such as API keys, tokens, passwords, and other environment-specific data, are stored in environment variables instead of being hardcoded into the source code.

## Features

- Detects hardcoded sensitive values based on `.env` files.
- Supports `.env` files to define environment variables.
- Allows configuration of environment files and control over which keys and values are checked.
- Ignores specific keys or values when configured.
- Predefined non-sensitive values (e.g., 'false', 'null', 'true') are automatically excluded from checks.

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

- `ignore` (optional): An array of uppercase strings representing the environment variable names (keys) to ignore.

  - The rule will not flag hardcoded values of ignored keys.

- `noSensitiveValues` (optional): An array of strings representing specific values to ignore as non-sensitive.

  - The rule will not flag these values even if they match a key from the environment file.
  - By default, the following values are ignored:
    ```json
    [
      "false",
      "null",
      "true",
      "undefined",
      "unknown",
      "nan",
      "infinity",
      "-infinity",
      "1234567890",
      "9876543210"
    ]
    ```
  - Additionally, dates in string format (e.g., `2024-10-20` or `10/20/2024`) are not considered sensitive. Numerical representations of dates (e.g., `1729464561272`) are allowed.
  - URLs defined in environment files are checked based on the hostname to determine if they contain sensitive information.
  - Values with 4 or fewer characters are not considered sensitive.

### Example Configuration

```json
{
  "rules": {
    "sensitive-env/no-hardcoded-values": [
      "error",
      {
        "envFile": ".env",
        "ignore": ["PUBLIC_LOCALHOST"],
        "noSensitiveValues": ["myPublicValue"]
      }
    ]
  }
}
```

In this configuration:

- `.env` is used as the environment file.
- The rule will ignore any hard-coded value for the key that contains `PUBLIC_LOCALHOST`.
- The value `myPublicValue` will not be flagged as sensitive, regardless of where it appears.

## Rule Details

The `no-hardcoded-values` rule checks for sensitive values that should be stored in environment variables instead of being hardcoded. It works by reading an environment file (e.g., `.env`) and matching values defined by the specified options.

If the environment file does not exist or cannot be found, the rule will produce a warning with the message:

```
The environment file <envFile> does not exist.
```

If a hardcoded sensitive value is found, the following error message will be reported:

```
Do not hardcode sensitive values. Use environment variables instead.
```

### Ignoring Specific Keys and Values

You can customize the behavior of the plugin by defining which keys and values to ignore.

### Example: Ignoring Specific Keys

```json
{
  "rules": {
    "sensitive-env/no-hardcoded-values": [
      "error",
      {
        "ignore": ["PASSWORD", "SECRET"]
      }
    ]
  }
}
```

In this case, values for `PASSWORD` and `SECRET` will be ignored, but other keys will still be checked.

### Example: Ignoring Specific Values

```json
{
  "rules": {
    "sensitive-env/no-hardcoded-values": [
      "error",
      {
        "noSensitiveValues": ["myPublicValue", "someOtherSafeValue"]
      }
    ]
  }
}
```

Here, `myPublicValue` and `someOtherSafeValue` will not be flagged, even if they appear as hardcoded values.

## Testing

To run the tests for this plugin:

```bash
npm test
```

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out [the issues page](https://github.com/JairTorres1003/eslint-plugin-sensitive-env/issues) if you have suggestions or encounter problems.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
