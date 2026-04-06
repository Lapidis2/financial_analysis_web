export type TransactionStatus = 'completed' | 'pending' | 'failed'
export type TransactionCategory = 'food' | 'transport' | 'shopping' | 'utilities' | 'entertainment' | 'healthcare' | 'income' | 'other'
export type UserRole = 'admin' | 'viewer'
export type SortField = 'date' | 'amount' | 'category'
export type SortOrder = 'asc' | 'desc'

export interface Transaction {
  id: string
  amount: number
  category: TransactionCategory
  date: string
  status: TransactionStatus
  description: string
}

export interface Filters {
  category: TransactionCategory | 'all'
  status: TransactionStatus | 'all'
  dateFrom: string
  dateTo: string
  search: string
}

export interface SortConfig {
  field: SortField
  order: SortOrder
}

export interface DashboardState {
  transactions: Transaction[]
  filters: Filters
  sort: SortConfig
  role: UserRole
  isLoading: boolean
}

export interface CategoryTotal {
  category: TransactionCategory
  total: number
  count: number
}

export interface BalanceTrend {
  date: string
  balance: number
}
