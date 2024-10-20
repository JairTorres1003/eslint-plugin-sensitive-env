import * as fs from 'fs'

import { type TSESLint } from '@typescript-eslint/utils'
import * as dotenv from 'dotenv'

import { IDENTIFIERS } from '@/constants/misc'
import { filterValuesByIdentifiers, getEnvironmentFile } from '@/utils/misc'

export interface NoHardcodedValuesRuleOptions {
  /**
   * The path to the environment file.
   * @example '.env.local'
   */
  envFile?: string
  /**
   * The identifiers to check for hardcoded values in the environment file.
   * @default ['API', 'URL', 'TOKEN', 'PASSWORD', 'SECRET', 'UUID', 'KEY', 'DOMAIN']
   */
  identifiers?: Array<Uppercase<string>>
  /**
   * The identifiers to ignore.
   * @default []
   */
  ignore?: Array<Uppercase<string>>
}

export type NoHardcodedValuesRuleMessageIds = 'noHardcodedValues' | 'environmentFileDoesNotExist'

export type NoHardcodedValuesRule = TSESLint.RuleModule<
  NoHardcodedValuesRuleMessageIds,
  NoHardcodedValuesRuleOptions[]
>

const noHardcodedValuesRule: NoHardcodedValuesRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Do not hardcode sensitive values. Use environment variables instead.',
    },
    messages: {
      noHardcodedValues: 'Do not hardcode sensitive values. Use environment variables instead.',
      environmentFileDoesNotExist: 'The environment file {{envFile}} does not exist.',
    },
    schema: [
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'No Hardcoded Values Rule Options',
        type: 'object',
        properties: {
          envFile: {
            type: 'string',
            description: 'The path to the environment file.',
            default: undefined,
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
          ignore: {
            type: 'array',
            items: {
              type: 'string',
              pattern: '^[A-Z0-9_]+$',
            },
            description: 'The identifiers to ignore. If defined, no identifiers will be used.',
            default: [],
          },
        },
      },
    ],
  },
  defaultOptions: [{ identifiers: IDENTIFIERS, ignore: [] }],
  create({ options = [], report, cwd }) {
    const envFile = options[0]?.envFile
    const identifiers = options[0]?.identifiers ?? IDENTIFIERS
    const ignore = options[0]?.ignore ?? []
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
    const sensitiveValues = filterValuesByIdentifiers(config, identifiers, ignore)

    return {
      Literal(node) {
        if (typeof node.value !== 'string') return

        const isSensitiveValue = sensitiveValues.some((value) => node.value.includes(value))
        if (isSensitiveValue) {
          report({ node, messageId: 'noHardcodedValues' })
        }
      },
    }
  },
}

export default noHardcodedValuesRule
