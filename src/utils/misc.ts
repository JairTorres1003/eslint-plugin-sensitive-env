import * as fs from 'fs'
import * as path from 'path'

import { ENV_FILES, NO_SENSITIVE_VALUES } from '@/constants/misc'

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
 * Checks if a value is a sensitive value.
 *
 * This function checks if a value is a sensitive value by comparing it to a list
 * of predefined values that are not considered sensitive. It also checks if the
 * value is a number or a date.
 *
 * @param value - The value to check.
 * @param noSensitiveValues - A list of values that are not considered sensitive.
 * @returns A boolean indicating whether the value is a sensitive value.
 */
export const isSensitiveValue = (value: string, noSensitiveValues: string[] = []): boolean => {
  try {
    if (value.trim().length <= 4) return false

    if ([...NO_SENSITIVE_VALUES, ...noSensitiveValues].includes(value.toLowerCase())) return false

    if (!isNaN(Number(value))) return false

    if (new Date(value).toString() !== 'Invalid Date') return false

    return true
  } catch (error) {
    return false
  }
}

/**
 * Filters sensitive values from a configuration object.
 *
 * This function filters sensitive values from a configuration object and returns
 * an array of the filtered values. It also allows for a list of identifiers to be
 * ignored and a list of values that are not considered sensitive.
 *
 * @param config - The configuration object to filter.
 * @param ignore - A list of identifiers to ignore.
 * @param noSensitiveValues - A list of values that are not considered sensitive.
 * @returns An array of sensitive values.
 */
export const filterValues = (
  config: Record<string, string>,
  ignore: Array<Uppercase<string>>,
  noSensitiveValues: string[] = []
): string[] => {
  const sensitiveValues: string[] = []

  Object.entries(config).forEach(([key, value]) => {
    if (!isSensitiveValue(value, noSensitiveValues) || value.trim() === '') return

    if (ignore.length > 0) {
      const keyUpper = key.toUpperCase() as Uppercase<string>

      if (ignore.some((identifier) => keyUpper.includes(identifier.toUpperCase()))) return
    }

    try {
      const hostname = new URL(value)?.hostname
      sensitiveValues.push(hostname ?? value)
    } catch (error) {
      sensitiveValues.push(value)
    }
  })

  return sensitiveValues
}
