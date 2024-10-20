import { RuleTester } from '@typescript-eslint/rule-tester'

import rule from '../rules/no-hardcoded-values'

const ruleTester = new RuleTester()

ruleTester.run('no-hardcoded-values', rule, {
  valid: [
    {
      code: `
        const apiKey = process.env.API_KEY;
        const secret = process.env.PUBLIC_CLIENT_SECRET;
        const myUrl = 'https://my-url.example.com';
      `,
      options: [{ identifiers: ['API_KEY', 'SECRET'], envFile: '.env.example' }],
    },
    {
      code: 'const urlApi = process.env.PUBLIC_API_URL + "status";',
    },
    {
      code: 'const password = process.env.PUBLIC_CLIENT_PASSWORD;',
    },
    {
      code: 'const someValue = "example_uuid";',
      options: [{ envFile: '.env.example', identifiers: ['CLIENT'] }],
    },
  ],
  invalid: [
    {
      code: "const apiKey = 'http://localhost:8000/api/';",
      errors: [{ messageId: 'noHardcodedValues' }],
    },
    {
      code: "const token = 'example_token';",
      errors: [{ messageId: 'noHardcodedValues' }],
    },
    {
      code: "const sensitiveValue = 'example_password';",
      options: [{ identifiers: ['PASSWORD'], envFile: '.env.example' }],
      errors: [{ messageId: 'noHardcodedValues' }],
    },
    {
      code: "const sensitiveUrl = 'https://sensitive-api.com';",
      options: [{ envFile: '.env.production', identifiers: ['URL'] }],
      errors: [{ messageId: 'environmentFileDoesNotExist' }],
    },
    {
      code: "const page = 'http://example.com/home';",
      errors: [{ messageId: 'noHardcodedValues' }],
    },
    {
      code: "const sensitiveUuid = 'example_uuid';",
      options: [{ envFile: '.env.example', identifiers: ['UUID'] }],
      errors: [{ messageId: 'noHardcodedValues' }],
    },
  ],
})
