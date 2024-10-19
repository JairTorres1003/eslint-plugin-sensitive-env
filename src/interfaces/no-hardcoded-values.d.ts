import { type TSESLint } from '@typescript-eslint/utils'

export interface NoHardcodedValuesRuleOptions {
  /**
   * The path to the environment file.
   * @example '.env.local'
   */
  envFile?: string
  /**
   * The identifiers to check for hardcoded values in the environment file.
   * @default ['API_KEY', 'URL', 'TOKEN', 'PASSWORD', 'SECRET', 'UUID', 'KEY', 'DOMAIN']
   */
  identifiers?: Array<Uppercase<string>>
}

export type NoHardcodedValuesRuleMessageIds =
  | 'noHardcodedValuesRule'
  | 'environmentFileDoesNotExist'

export type NoHardcodedValuesRule = TSESLint.RuleModule<
  NoHardcodedValuesRuleMessageIds,
  NoHardcodedValuesRuleOptions[]
>
