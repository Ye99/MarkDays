# Testing Documentation

## Overview

This document outlines the comprehensive testing strategy implemented for the Mark Days daily activity tracking application. The testing suite protects business logic through unit tests, integration tests, and component tests.

## Testing Framework

- **Test Runner**: Vitest (compatible with Vite)
- **Component Testing**: React Testing Library
- **Mocking**: Vitest's built-in mocking capabilities
- **Coverage**: v8 coverage provider

## Test Structure

### 1. Business Logic Tests (`src/utils/__tests__/medicationTracker.test.ts`)

These tests protect the core business logic functions:

#### `toggleMedicationDay`
- ✅ Adds a day when not marked
- ✅ Removes a day when already marked
- ✅ Does not mutate the original set
- ✅ Handles multiple days correctly

#### `isDayMarked`
- ✅ Returns true for marked days
- ✅ Returns false for unmarked days
- ✅ Handles empty set

#### `arrayToMarkedDaysSet` / `markedDaysSetToArray`
- ✅ Converts between arrays and sets
- ✅ Handles null/empty inputs
- ✅ Handles duplicate entries

#### `getMedicationStreak`
- ✅ Calculates consecutive day streaks
- ✅ Returns 0 for no streak
- ✅ Handles single day streaks
- ✅ Stops at first gap in streak

#### `getMedicationStats`
- ✅ Calculates statistics for date ranges
- ✅ Handles single day ranges
- ✅ Handles empty data
- ✅ Rounds percentages correctly

#### `isValidDateString`
- ✅ Validates correct date strings
- ✅ Rejects invalid date strings
- ✅ Handles edge cases (leap years)

### 2. Custom Hook Tests (`src/hooks/__tests__/useMedicationTracker.test.ts`)

Tests for the `useMedicationTracker` hook that manages state and persistence:

#### State Management
- ✅ Initializes with empty state
- ✅ Loads marked days from store on mount
- ✅ Handles empty store data
- ✅ Handles load errors gracefully

#### Day Operations
- ✅ Toggles day correctly (mark/unmark)
- ✅ Checks if day is marked correctly
- ✅ Reverts state on save errors

#### Error Handling
- ✅ Clears errors on successful operations
- ✅ Provides reload functionality

### 3. Component Integration Tests (`src/components/__tests__/CalendarView.test.tsx`)

Tests for the main CalendarView component:

#### Rendering
- ✅ Renders calendar with title and instructions
- ✅ Applies marked-day CSS classes

#### Data Loading
- ✅ Loads marked days from store on mount
- ✅ Handles empty store data gracefully
- ✅ Handles store loading errors gracefully

#### User Interactions
- ✅ Marks a day when clicked
- ✅ Toggles day status on multiple clicks
- ✅ Preserves existing marked days when adding new ones
- ✅ Handles save errors gracefully

## Test Coverage

Current test coverage (as of latest run):

```
File                     | % Stmts | % Branch | % Funcs | % Lines
-------------------------|---------|----------|---------|--------
All files                |   78.78 |    84.31 |   70.58 |   78.78
src/components           |   60.86 |    93.75 |      80 |   60.86
src/hooks                |     100 |    86.66 |     100 |     100
src/utils                |     100 |    93.75 |     100 |     100
```

### Key Coverage Highlights

- **Business Logic (utils)**: 100% statement and function coverage
- **Custom Hook**: 100% statement and function coverage
- **Component Logic**: High branch coverage (93.75%)

## Mocking Strategy

### Tauri Store API
The tests mock the Tauri store API to:
- Simulate data loading from persistent storage
- Test error conditions (load/save failures)
- Verify correct data persistence calls
- Enable testing without actual file system operations

```typescript
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
```

## Running Tests

### Commands Available

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage
```

### Test Setup

The test setup includes:
- Jest DOM matchers for enhanced assertions
- Tauri API mocking
- Automatic mock cleanup between tests

## Protected Business Logic

The test suite specifically protects these critical business functions:

1. **Data Integrity**: Ensures marked days are correctly added/removed
2. **State Immutability**: Verifies original data structures aren't mutated
3. **Error Handling**: Tests graceful degradation on failures
4. **Data Persistence**: Validates correct storage operations
5. **Date Calculations**: Protects streak and statistics calculations
6. **Edge Cases**: Handles empty data, invalid inputs, and boundary conditions

## Continuous Integration

The test suite is designed to:
- Run quickly (< 2 seconds)
- Provide clear failure messages
- Cover critical user workflows
- Prevent regressions in business logic
- Ensure data consistency

## Future Testing Considerations

1. **E2E Tests**: Consider adding Playwright/Cypress for full user workflows
2. **Visual Regression**: Add screenshot testing for UI consistency
3. **Performance Tests**: Add tests for large datasets
4. **Accessibility Tests**: Ensure calendar is accessible to all users

## Test Maintenance

- Tests use actual `Date.toDateString()` format for consistency
- Mocks are reset between tests to prevent interference
- Test data uses realistic date ranges
- Error conditions are explicitly tested 