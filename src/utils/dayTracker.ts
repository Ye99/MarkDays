/**
 * Business logic utilities for day tracking
 */

/**
 * Toggle a day's marked status
 * @param markedDays Current set of marked days
 * @param dateString Date string to toggle
 * @returns New set with the day toggled
 */
export const toggleDay = (markedDays: Set<string>, dateString: string): Set<string> => {
  const newMarkedDays = new Set(markedDays)
  
  if (newMarkedDays.has(dateString)) {
    newMarkedDays.delete(dateString)
  } else {
    newMarkedDays.add(dateString)
  }
  
  return newMarkedDays
}

/**
 * Check if a specific date is marked
 * @param markedDays Set of marked days
 * @param date Date to check
 * @returns True if the date is marked
 */
export const isDayMarked = (markedDays: Set<string>, date: Date): boolean => {
  return markedDays.has(date.toDateString())
}

/**
 * Convert array of date strings to Set
 * @param dateStrings Array of date strings
 * @returns Set of date strings
 */
export const arrayToMarkedDaysSet = (dateStrings: string[] | null): Set<string> => {
  if (!dateStrings) return new Set()
  return new Set(dateStrings)
}

/**
 * Convert Set to array for storage
 * @param markedDays Set of marked days
 * @returns Array of date strings
 */
export const markedDaysSetToArray = (markedDays: Set<string>): string[] => {
  return Array.from(markedDays)
} 