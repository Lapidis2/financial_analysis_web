import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DashboardState, Filters, SortConfig, Transaction, UserRole } from '@/types'
import { generateMockTransactions } from '@/utils/mock-data'

const initialFilters: Filters = {
  category: 'all',
  status: 'all',
  dateFrom: '',
  dateTo: '',
  search: ''
}

const initialSort: SortConfig = {
  field: 'date',
  order: 'desc'
}

function loadStateFromStorage(): Partial<DashboardState> | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem('dashboard-state')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    return null
  }
  return null
}

function saveStateToStorage(state: DashboardState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('dashboard-state', JSON.stringify({
      filters: state.filters,
      sort: state.sort,
      role: state.role
    }))
  } catch {
    // Ignore storage errors
  }
}

const savedState = loadStateFromStorage()

const initialState: DashboardState = {
  transactions: generateMockTransactions(50),
  filters: savedState?.filters || initialFilters,
  sort: savedState?.sort || initialSort,
  role: savedState?.role || 'admin',
  isLoading: false
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      saveStateToStorage(state)
    },
    resetFilters: (state) => {
      state.filters = initialFilters
      saveStateToStorage(state)
    },
    setSort: (state, action: PayloadAction<SortConfig>) => {
      state.sort = action.payload
      saveStateToStorage(state)
    },
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload
      saveStateToStorage(state)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload)
    }
  }
})

export const { setFilter, resetFilters, setSort, setRole, setLoading, addTransaction } = dashboardSlice.actions
export default dashboardSlice.reducer
