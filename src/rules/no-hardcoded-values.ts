import * as fs from 'fs'

import * as dotenv from 'dotenv'

import { IDENTIFIERS } from '@/constants/misc'
import { type NoHardcodedValuesRule } from '@/interfaces/no-hardcoded-values'
import { filterValuesByIdentifiers, getEnvironmentFile } from '@/utils/misc'

const noHardcodedValuesRule: NoHardcodedValuesRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Do not hardcode sensitive values. Use environment variables instead.',
    },
    messages: {
      noHardcodedValuesRule: 'Do not hardcode sensitive values. Use environment variables instead.',
      environmentFileDoesNotExist: 'The environment file {{envFile}} does not exist.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          envFile: {
            type: 'string',
            description: 'The path to the environment file.',
          },
          identifiers: {
            type: 'array',
            items: {
              type: 'string',
              pattern: '^[A-Z0-9_]+$',
            },
            description: 'The identifiers to check for hardcoded values in the environment file.',
            default: IDENTIFIERS,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ identifiers: IDENTIFIERS }],
  create({ options = [], report, cwd }) {
    const [{ envFile, identifiers = IDENTIFIERS }] = options
    const environmentFile = getEnvironmentFile(cwd, envFile)

    if (environmentFile === undefined || !fs.existsSync(environmentFile)) {
      report({
        loc: { line: 1, column: 0 },
        messageId: 'environmentFileDoesNotExist',
        data: { envFile: environmentFile },
      })
      return {}
    }

    const config = dotenv.parse(fs.readFileSync(environmentFile))
    const sensitiveValues = filterValuesByIdentifiers(config, identifiers)

    return {
      Literal(node) {
        if (typeof node.value !== 'string') return

        if (sensitiveValues.includes(node.value)) {
          report({ node, messageId: 'noHardcodedValuesRule' })
        }
      },
    }
  },
}

export default noHardcodedValuesRule
