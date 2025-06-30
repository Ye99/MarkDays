import { describe, it, expect } from 'vitest'
import {
  toggleDay,
  isDayMarked,
  arrayToMarkedDaysSet,
  markedDaysSetToArray,
} from '../dayTracker'

describe('dayTracker', () => {
  describe('toggleDay', () => {
    it('should add a day when not marked', () => {
      const markedDays = new Set<string>()
      const dateString = 'Mon Jan 01 2024'
      
      const result = toggleDay(markedDays, dateString)
      
      expect(result.has(dateString)).toBe(true)
      expect(result.size).toBe(1)
    })

    it('should remove a day when already marked', () => {
      const markedDays = new Set(['Mon Jan 01 2024'])
      const dateString = 'Mon Jan 01 2024'
      
      const result = toggleDay(markedDays, dateString)
      
      expect(result.has(dateString)).toBe(false)
      expect(result.size).toBe(0)
    })

    it('should not mutate the original set', () => {
      const markedDays = new Set(['Mon Jan 01 2024'])
      const dateString = 'Tue Jan 02 2024'
      
      const result = toggleDay(markedDays, dateString)
      
      expect(markedDays.size).toBe(1)
      expect(result.size).toBe(2)
      expect(markedDays !== result).toBe(true)
    })

    it('should handle multiple days correctly', () => {
      const markedDays = new Set(['Mon Jan 01 2024', 'Wed Jan 03 2024'])
      const dateString = 'Tue Jan 02 2024'
      
      const result = toggleDay(markedDays, dateString)
      
      expect(result.size).toBe(3)
      expect(result.has('Mon Jan 01 2024')).toBe(true)
      expect(result.has('Tue Jan 02 2024')).toBe(true)
      expect(result.has('Wed Jan 03 2024')).toBe(true)
    })
  })

  describe('isDayMarked', () => {
    it('should return true for marked days', () => {
      const date = new Date('2024-01-01')
      const markedDays = new Set([date.toDateString()])
      
      const result = isDayMarked(markedDays, date)
      
      expect(result).toBe(true)
    })

    it('should return false for unmarked days', () => {
      const markedDate = new Date('2024-01-01')
      const unmarkedDate = new Date('2024-01-02')
      const markedDays = new Set([markedDate.toDateString()])
      
      const result = isDayMarked(markedDays, unmarkedDate)
      
      expect(result).toBe(false)
    })

    it('should handle empty set', () => {
      const markedDays = new Set<string>()
      const date = new Date('2024-01-01')
      
      const result = isDayMarked(markedDays, date)
      
      expect(result).toBe(false)
    })
  })

  describe('arrayToMarkedDaysSet', () => {
    it('should convert array to set', () => {
      const dateStrings = ['Mon Jan 01 2024', 'Tue Jan 02 2024']
      
      const result = arrayToMarkedDaysSet(dateStrings)
      
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(2)
      expect(result.has('Mon Jan 01 2024')).toBe(true)
      expect(result.has('Tue Jan 02 2024')).toBe(true)
    })

    it('should handle null input', () => {
      const result = arrayToMarkedDaysSet(null)
      
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })

    it('should handle empty array', () => {
      const result = arrayToMarkedDaysSet([])
      
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })

    it('should handle duplicate entries', () => {
      const dateStrings = ['Mon Jan 01 2024', 'Mon Jan 01 2024', 'Tue Jan 02 2024']
      
      const result = arrayToMarkedDaysSet(dateStrings)
      
      expect(result.size).toBe(2)
    })
  })

  describe('markedDaysSetToArray', () => {
    it('should convert set to array', () => {
      const markedDays = new Set(['Mon Jan 01 2024', 'Tue Jan 02 2024'])
      
      const result = markedDaysSetToArray(markedDays)
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
      expect(result).toContain('Mon Jan 01 2024')
      expect(result).toContain('Tue Jan 02 2024')
    })

    it('should handle empty set', () => {
      const markedDays = new Set<string>()
      
      const result = markedDaysSetToArray(markedDays)
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })
  })
}) 