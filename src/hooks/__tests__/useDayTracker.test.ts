import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useDayTracker } from '../useDayTracker'
import { MARKED_DAYS_STORAGE_KEY } from '../../constants/storage'

// Mock the store
const mockStore = {
  get: vi.fn(),
  set: vi.fn(),
  save: vi.fn(),
}

vi.mock('@tauri-apps/plugin-store', () => ({
  Store: {
    load: vi.fn(() => Promise.resolve(mockStore)),
  },
}))

describe('useDayTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.get.mockResolvedValue(null)
    mockStore.set.mockResolvedValue(undefined)
    mockStore.save.mockResolvedValue(undefined)
  })

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useDayTracker())
    
    expect(result.current.markedDays.size).toBe(0)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBe(null)
  })

  it('should load marked days from store on mount', async () => {
    const date1 = new Date('2024-01-01')
    const date2 = new Date('2024-01-02')
    const savedDays = [date1.toDateString(), date2.toDateString()]
    mockStore.get.mockResolvedValue(savedDays)
    
    const { result } = renderHook(() => useDayTracker())
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(mockStore.get).toHaveBeenCalledWith(MARKED_DAYS_STORAGE_KEY)
    expect(result.current.markedDays.size).toBe(2)
    expect(result.current.markedDays.has(date1.toDateString())).toBe(true)
    expect(result.current.markedDays.has(date2.toDateString())).toBe(true)
  })

  it('should handle empty store data', async () => {
    mockStore.get.mockResolvedValue(null)
    
    const { result } = renderHook(() => useDayTracker())
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.markedDays.size).toBe(0)
    expect(result.current.error).toBe(null)
  })

  it('should handle load errors', async () => {
    const error = new Error('Store load error')
    mockStore.get.mockRejectedValue(error)
    
    const { result } = renderHook(() => useDayTracker())
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.error).toBe('Store load error')
    expect(result.current.markedDays.size).toBe(0)
  })

  it('should toggle day correctly', async () => {
    const { result } = renderHook(() => useDayTracker())
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    const testDate = new Date('2024-01-01')
    
    await act(async () => {
      await result.current.toggleDay(testDate)
    })
    
    expect(result.current.markedDays.has(testDate.toDateString())).toBe(true)
    expect(mockStore.set).toHaveBeenCalledWith(MARKED_DAYS_STORAGE_KEY, [testDate.toDateString()])
    expect(mockStore.save).toHaveBeenCalled()
  })

  it('should toggle day off when already marked', async () => {
    const testDate = new Date('2024-01-01')
    const savedDays = [testDate.toDateString()]
    mockStore.get.mockResolvedValue(savedDays)
    
    const { result } = renderHook(() => useDayTracker())
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    await act(async () => {
      await result.current.toggleDay(testDate)
    })
    
    expect(result.current.markedDays.has(testDate.toDateString())).toBe(false)
    expect(mockStore.set).toHaveBeenCalledWith(MARKED_DAYS_STORAGE_KEY, [])
    expect(mockStore.save).toHaveBeenCalled()
  })

  it('should revert state on save error', async () => {
    const date1 = new Date('2024-01-01')
    const date2 = new Date('2024-01-02')
    const savedDays = [date1.toDateString()]
    mockStore.get.mockResolvedValue(savedDays)
    mockStore.save.mockRejectedValue(new Error('Save error'))
    
    const { result } = renderHook(() => useDayTracker())
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    await act(async () => {
      await result.current.toggleDay(date2)
    })
    
    // Should revert to original state
    expect(result.current.markedDays.has(date1.toDateString())).toBe(true)
    expect(result.current.markedDays.has(date2.toDateString())).toBe(false)
    expect(result.current.error).toBe('Save error')
  })

  it('should check if day is marked correctly', async () => {
    const markedDate = new Date('2024-01-01')
    const savedDays = [markedDate.toDateString()]
    mockStore.get.mockResolvedValue(savedDays)
    
    const { result } = renderHook(() => useDayTracker())
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    const unmarkedDate = new Date('2024-01-02')
    
    expect(result.current.isDayMarked(markedDate)).toBe(true)
    expect(result.current.isDayMarked(unmarkedDate)).toBe(false)
  })

  it('should reload data when reload is called', async () => {
    const { result } = renderHook(() => useDayTracker())
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    // Clear the mock call count
    vi.clearAllMocks()
    
    await act(async () => {
      await result.current.reload()
    })
    
    expect(mockStore.get).toHaveBeenCalledWith(MARKED_DAYS_STORAGE_KEY)
  })

  it('should clear error on successful save', async () => {
    // First, cause an error
    mockStore.save.mockRejectedValueOnce(new Error('Initial error'))
    
    const { result } = renderHook(() => useDayTracker())
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    const testDate = new Date('2024-01-01')
    
    // This should cause an error
    await act(async () => {
      await result.current.toggleDay(testDate)
    })
    
    expect(result.current.error).toBe('Initial error')
    
    // Now fix the save and try again
    mockStore.save.mockResolvedValue(undefined)
    
    await act(async () => {
      await result.current.toggleDay(testDate)
    })
    
    expect(result.current.error).toBe(null)
  })
}) 