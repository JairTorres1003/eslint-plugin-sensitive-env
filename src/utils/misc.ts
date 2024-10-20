import * as fs from 'fs'
import * as path from 'path'

import { ENV_FILES } from '@/constants/misc'

/**
 * Checks if a value is empty.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is empty.
 */
export const isEmpty = (
  value: unknown
): value is null | undefined | '' | [] | Record<string, unknown> => {
  if (value === null || value === undefined) return true

  if (typeof value === 'string' && value.trim() === '') return true

  if (Array.isArray(value) && value.length === 0) return true

  if (
    typeof value === 'object' &&
    Object.keys(value).length === 0 &&
    value.constructor === Object
  ) {
    return true
  }

  if (value instanceof Error && value.message.trim() === '') return true

  return false
}

/**
 * Retrieves the path to the environment file.
 *
 * This function attempts to resolve the path to a specified environment file.
 * If no specific file is provided, it searches through a predefined list of
 * environment files and returns the path to the first one that exists.
 *
 * @param cwd - The current working directory passed to Linter. It is a path to a
 *              directory that should be considered as the current working directory.
 * @param envFile - The name of the environment file to resolve. If not provided,
 *                  the function will search through a list of predefined files.
 * @returns The resolved path to the environment file, or `undefined` if no file is found.
 */
export const getEnvironmentFile = (cwd: string, envFile?: string): string | undefined => {
  if (!isEmpty(envFile)) {
    return path.resolve(cwd, envFile)
  }

  for (const file of ENV_FILES) {
    const filePath = path.resolve(cwd, file)

    if (fs.existsSync(filePath)) return filePath
  }

  return undefined
}

/**
 * Filters values from a configuration object by their identifiers.
 *
 * This function filters values from a configuration object by their identifiers.
 * It returns an array of values that correspond to the identifiers provided.
 *
 * @param config - The configuration object to filter.
 * @param identifiers - The identifiers to filter by.
 * @param ignore - The identifiers to ignore.
 * @returns An array of values that correspond to the identifiers provided.
 */
export const filterValuesByIdentifiers = (
  config: Record<string, string>,
  identifiers: Array<Uppercase<string>>,
  ignore: Array<Uppercase<string>>
): string[] => {
  let sensitiveValues = Object.entries(config)

  if (identifiers.length > 0 || ignore.length > 0) {
    sensitiveValues = sensitiveValues.filter(([key]) => {
      const keyUpper = key.toUpperCase() as Uppercase<string>

      if (ignore.length > 0) {
        return !ignore.some((identifier) => keyUpper.includes(identifier.toUpperCase()))
      }

      return identifiers.some((identifier) => keyUpper.includes(identifier.toUpperCase()))
    })
  }

  return sensitiveValues.map(([, value]) => {
    try {
      const isUrl = new URL(value)
      return isUrl.hostname
    } catch (error) {
      return value
    }
  })
}
