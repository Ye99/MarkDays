import '@testing-library/jest-dom'

// Mock Tauri APIs
const mockStore = {
  load: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  save: vi.fn(),
}

vi.mock('@tauri-apps/plugin-store', () => ({
  Store: {
    load: vi.fn(() => Promise.resolve(mockStore)),
  },
}))

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
}) 