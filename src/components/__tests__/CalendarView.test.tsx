import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import CalendarView from '../CalendarView'
import { MARKED_DAYS_STORAGE_KEY, MARKED_DAY_CSS_CLASS } from '../../constants/storage'

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

describe('CalendarView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.get.mockResolvedValue(null)
    mockStore.set.mockResolvedValue(undefined)
    mockStore.save.mockResolvedValue(undefined)
  })

  it('should render calendar with title and instructions', async () => {
    render(<CalendarView />)
    
    expect(screen.getByText('Mark Days')).toBeInTheDocument()
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
    
    expect(screen.getByText('Click on a day to mark it as completed.')).toBeInTheDocument()
    expect(document.querySelector('.react-calendar')).toBeInTheDocument()
  })

  it('should render legend with all expected items', async () => {
    render(<CalendarView />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
    
    // Check legend title
    expect(screen.getByText('Legend')).toBeInTheDocument()
    
    // Check all legend items
    expect(screen.getByText('Unmarked day')).toBeInTheDocument()
    expect(screen.getByText('Marked day')).toBeInTheDocument()
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Today (marked)')).toBeInTheDocument()
    
    // Check legend color indicators
    expect(document.querySelector('.legend-color.unmarked-day')).toBeInTheDocument()
    expect(document.querySelector('.legend-color.marked-day')).toBeInTheDocument()
    expect(document.querySelector('.legend-color.today-day')).toBeInTheDocument()
    expect(document.querySelector('.legend-color.today-marked-day')).toBeInTheDocument()
  })

  it('should load marked days from store on mount', async () => {
    const date1 = new Date('2024-01-01')
    const date2 = new Date('2024-01-02')
    const savedDays = [date1.toDateString(), date2.toDateString()]
    mockStore.get.mockResolvedValue(savedDays)
    
    render(<CalendarView />)
    
    await waitFor(() => {
      expect(mockStore.get).toHaveBeenCalledWith('markedDays')
    })
  })

  it('should handle empty store data gracefully', async () => {
    mockStore.get.mockResolvedValue(null)
    
    render(<CalendarView />)
    
    await waitFor(() => {
      expect(mockStore.get).toHaveBeenCalledWith('markedDays')
    })
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
    
    // Should not crash and should render normally
    expect(screen.getByText('Mark Days')).toBeInTheDocument()
  })

  it('should handle store loading errors gracefully', async () => {
    mockStore.get.mockRejectedValue(new Error('Store error'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<CalendarView />)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error loading marked days:', expect.any(Error))
    })
    
    // Should display error message
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument()
    })
    
    // Should still render normally despite error
    expect(screen.getByText('Mark Days')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('should handle user interactions with day clicking', async () => {
    const user = userEvent.setup()
    render(<CalendarView />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
    
    const dayButtons = screen.getAllByRole('button')
    const firstDayButton = dayButtons.find(button => 
      button.textContent && /^\d+$/.test(button.textContent)
    )
    
    if (firstDayButton) {
      await user.click(firstDayButton)
      
      await waitFor(() => {
        expect(mockStore.set).toHaveBeenCalledWith('markedDays', expect.arrayContaining([expect.any(String)]))
        expect(mockStore.save).toHaveBeenCalled()
      })
    }
  })

  it('should handle save errors during interactions', async () => {
    mockStore.save.mockRejectedValue(new Error('Save error'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    
    render(<CalendarView />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
    
    const dayButtons = screen.getAllByRole('button')
    const firstDayButton = dayButtons.find(button => 
      button.textContent && /^\d+$/.test(button.textContent)
    )
    
    if (firstDayButton) {
      await user.click(firstDayButton)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error saving marked days:', expect.any(Error))
      })
    }
    
    consoleSpy.mockRestore()
  })

  it('should apply marked-day class to marked days', async () => {
    // Use a date that's likely to be visible in the current month
    const today = new Date()
    const savedDays = [today.toDateString()]
    mockStore.get.mockResolvedValue(savedDays)
    
    render(<CalendarView />)
    
    await waitFor(() => {
      expect(mockStore.get).toHaveBeenCalledWith('markedDays')
    })
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
    
    // Wait for the component to update with loaded data
    await waitFor(() => {
      const markedElements = document.querySelectorAll(`.${MARKED_DAY_CSS_CLASS}`)
      expect(markedElements.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it('should apply marked-day class to dates from neighboring months', async () => {
    // Test a date that might appear in neighboring month view (use current year to ensure visibility)
    const today = new Date()
    const currentYear = today.getFullYear()
    const crossMonthDate = new Date(currentYear, 5, 30) // June 30 of current year
    const savedDays = [crossMonthDate.toDateString()]
    mockStore.get.mockResolvedValue(savedDays)
    
    render(<CalendarView />)
    
    await waitFor(() => {
      expect(mockStore.get).toHaveBeenCalledWith('markedDays')
    })
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
    
    // Wait for the component to update with loaded data
    await waitFor(() => {
      // The marked day should have the marked-day class regardless of which month view it appears in
      const markedElements = document.querySelectorAll(`.${MARKED_DAY_CSS_CLASS}`)
      expect(markedElements.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it('should toggle day status when clicked multiple times', async () => {
    const user = userEvent.setup()
    render(<CalendarView />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
    
    const dayButtons = screen.getAllByRole('button')
    const firstDayButton = dayButtons.find(button => 
      button.textContent && /^\d+$/.test(button.textContent)
    )
    
    if (firstDayButton) {
      // First click - mark the day
      await user.click(firstDayButton)
      
      await waitFor(() => {
        expect(mockStore.set).toHaveBeenCalledWith('markedDays', expect.arrayContaining([expect.any(String)]))
      })
      
      // Second click - unmark the day
      await user.click(firstDayButton)
      
      await waitFor(() => {
        expect(mockStore.set).toHaveBeenLastCalledWith('markedDays', [])
      })
    }
  })

  it('should preserve existing marked days when adding new ones', async () => {
    const existingDate = new Date('2024-01-01')
    const savedDays = [existingDate.toDateString()]
    mockStore.get.mockResolvedValue(savedDays)
    const user = userEvent.setup()
    
    render(<CalendarView />)
    
    await waitFor(() => {
      expect(mockStore.get).toHaveBeenCalledWith('markedDays')
    })
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
    
    const dayButtons = screen.getAllByRole('button')
    const firstDayButton = dayButtons.find(button => 
      button.textContent && /^\d+$/.test(button.textContent)
    )
    
    if (firstDayButton) {
      await user.click(firstDayButton)
      
      await waitFor(() => {
        expect(mockStore.set).toHaveBeenCalledWith('markedDays', expect.arrayContaining([
          existingDate.toDateString(),
          expect.any(String)
        ]))
      })
    }
  })
}) 