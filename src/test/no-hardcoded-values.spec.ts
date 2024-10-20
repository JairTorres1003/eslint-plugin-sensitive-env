import { RuleTester } from '@typescript-eslint/rule-tester'

import rule, {
  NoHardcodedValuesRuleMessageIds,
  NoHardcodedValuesRuleOptions,
} from '../rules/no-hardcoded-values'

const ruleTester = new RuleTester()

ruleTester.run<NoHardcodedValuesRuleMessageIds, NoHardcodedValuesRuleOptions[]>(
  'no-hardcoded-values',
  rule,
  {
    valid: [
      {
        name: 'If the value is a non-sensitive string, it should be allowed',
        code: "const isNotSensitive = 'Hello, World!'",
      },
      {
        name: 'If the value is a non-sensitive data type, it should be allowed',
        code: "const noSensitiveData = ['false', 'null', 'true', 'undefined', 'unknown', 'NaN', 'Infinity', '-Infinity', '1234567890']",
      },
      {
        name: 'If the value is a non-sensitive custom value, it should be allowed',
        code: "const noSensitiveData = ['custom_no_sensitive_value_1', 'custom_no_sensitive_value_2']",
        options: [
          { noSensitiveValues: ['custom_no_sensitive_value_1', 'custom_no_sensitive_value_2'] },
        ],
      },
      {
        name: 'If the value is a non-sensitive number, it should be allowed',
        code: "const numberNoSensitives = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']",
      },
      {
        name: 'If the value is not less than 4 characters, it should be allowed',
        code: "const noSensitiveValues = ['1234', '5678', 'abcd', 'efgh', '1', '12ab', 'a1', 'a1b']",
      },
      {
        name: 'If the value is a date, it should be allowed',
        code: "const notSensitiveDate = ['2021-01-01', '2021-01-01T00:00:00.000Z', '2021-01-01T00:00:00.000+00:00', '2021-01-01T00:00:00.000+0000']",
      },
      {
        name: 'If the value is in the ignore list, it should be allowed',
        code: "const sensitiveIgnores = ['example_sensitive_1', 'example_sensitive_2', process.env.SENSITIVE_VALUE_3]",
        options: [{ ignore: ['VALUE_1', 'VALUE_2'] }],
      },
      {
        name: 'If the value is in the environment file, it should be allowed',
        code: 'const url = process.env.PUBLIC_URL_2',
        options: [{ envFile: '.env.example' }],
      },
    ],
    invalid: [
      {
        name: 'If the value is a sensitive string, it should be disallowed',
        code: "const sensitiveValue = 'example_sensitive_1'",
        errors: [{ messageId: 'noHardcodedValues' }],
      },
      {
        name: 'If the value is a sensitive string, it should be disallowed',
        code: 'const sensitiveValue = `${1}_example_sensitive_2`',
        errors: [{ messageId: 'noHardcodedValues' }],
      },
      {
        name: 'If the value is a sensitive custom value, it should be disallowed',
        code: "const sensitive = 'example_sensitive_1'",
        options: [{ noSensitiveValues: ['example_sensitive_2'] }],
        errors: [{ messageId: 'noHardcodedValues' }],
      },
      {
        name: 'If the value is longer than 4 characters, it should be disallowed',
        code: "const sensitive = ['eyJhbGcijosdaf769aofn212cCI6IkpXVCJ9', 'eyJhbGci', 0, 1, '1234567890']",
        errors: [{ messageId: 'noHardcodedValues' }],
      },
      {
        name: 'If the value is in the ignore list, it should be disallowed',
        code: "const sensitiveIgnores = ['example_sensitive_1', 'example_sensitive_4', 'example_sensitive_3', 'https://example.com']",
        options: [{ ignore: ['VALUE'] }],
        errors: [{ messageId: 'noHardcodedValues' }],
      },
      {
        name: 'If the file does not exist, an error should be thrown',
        code: 'const url = process.env.PUBLIC_URL_2',
        options: [{ envFile: '.env.test' }],
        errors: [{ messageId: 'environmentFileDoesNotExist' }],
      },
      {
        name: 'If the value is a URL and it exists in the env file, only the host should be validated',
        code: "const url = 'example.com'",
        errors: [{ messageId: 'noHardcodedValues' }],
      },
    ],
  }
)
