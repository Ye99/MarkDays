import { useState, useEffect, useCallback } from 'react'
import { Store } from '@tauri-apps/plugin-store'
import {
  toggleDay,
  arrayToMarkedDaysSet,
  markedDaysSetToArray,
} from '../utils/dayTracker'
import { DATA_FILE_NAME, MARKED_DAYS_STORAGE_KEY } from '../constants/storage'

export const useDayTracker = () => {
  const [markedDays, setMarkedDays] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMarkedDays = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const store = await Store.load(DATA_FILE_NAME)
      const savedDays = await store.get<string[]>(MARKED_DAYS_STORAGE_KEY)
      
      if (savedDays) {
        setMarkedDays(arrayToMarkedDaysSet(savedDays))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load marked days'
      setError(errorMessage)
      console.error('Error loading marked days:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveMarkedDays = useCallback(async (days: Set<string>) => {
    try {
      const store = await Store.load(DATA_FILE_NAME)
      await store.set(MARKED_DAYS_STORAGE_KEY, markedDaysSetToArray(days))
      await store.save()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save marked days'
      setError(errorMessage)
      console.error('Error saving marked days:', err)
      throw err // Re-throw to allow component to handle
    }
  }, [])

  const toggleDayHandler = useCallback(async (date: Date) => {
    const dateString = date.toDateString()
    const newMarkedDays = toggleDay(markedDays, dateString)
    
    setMarkedDays(newMarkedDays)
    
    try {
      await saveMarkedDays(newMarkedDays)
      setError(null) // Clear any previous errors on successful save
    } catch (err) {
      // Revert the state change on save failure
      setMarkedDays(markedDays)
    }
  }, [markedDays, saveMarkedDays])

  const isDayMarked = useCallback((date: Date): boolean => {
    return markedDays.has(date.toDateString())
  }, [markedDays])

  useEffect(() => {
    loadMarkedDays()
  }, [loadMarkedDays])

  return {
    markedDays,
    isLoading,
    error,
    toggleDay: toggleDayHandler,
    isDayMarked,
    reload: loadMarkedDays,
  }
} 