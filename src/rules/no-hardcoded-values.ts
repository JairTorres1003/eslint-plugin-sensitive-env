import * as fs from 'fs'

import { type TSESLint } from '@typescript-eslint/utils'
import * as dotenv from 'dotenv'

import { filterValues, getEnvironmentFile } from '@/utils/misc'

export interface NoHardcodedValuesRuleOptions {
  /**
   * The path to the environment file.
   * @example '.env.local'
   */
  envFile?: string
  /**
   * The identifiers to ignore.
   * @default []
   */
  ignore?: Array<Uppercase<string>>
  /**
   * The values that are not considered sensitive.
   * @default []
   */
  noSensitiveValues?: string[]
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
          ignore: {
            type: 'array',
            items: {
              type: 'string',
              pattern: '^[A-Z0-9_]+$',
            },
            description: 'The identifiers to ignore. If defined, no identifiers will be used.',
            default: [],
          },
          noSensitiveValues: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'The values that are not considered sensitive.',
            default: [],
          },
        },
      },
    ],
  },
  defaultOptions: [{ ignore: [], noSensitiveValues: [] }],
  create({ options = [], report, cwd }) {
    const envFile = options[0]?.envFile
    const ignore = options[0]?.ignore ?? []
    const noSensitiveValues = (options[0]?.noSensitiveValues ?? []).map((value) =>
      value.toLowerCase()
    )
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
    const sensitiveValues = filterValues(config, ignore, noSensitiveValues)

    if (sensitiveValues.length === 0) return {}

    return {
      Literal(node) {
        if (typeof node.value !== 'string' && typeof node.value !== 'number') return
        const currentValue = node.value?.toString()

        const isSensitiveValue = sensitiveValues.some((value) => currentValue.includes(value))
        if (isSensitiveValue) {
          report({ node, messageId: 'noHardcodedValues' })
        }
      },
      TemplateLiteral(node) {
        const currentValue = node.quasis.map((quasi) => quasi.value.raw).join('')
        const isSensitiveValue = sensitiveValues.some((value) => currentValue.includes(value))
        if (isSensitiveValue) {
          report({ node, messageId: 'noHardcodedValues' })
        }
      },
    }
  },
}

export default noHardcodedValuesRule
