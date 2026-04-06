import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { Transaction, CategoryTotal, BalanceTrend } from '@/types'

export const selectTransactions = (state: RootState) => state.dashboard.transactions
export const selectFilters = (state: RootState) => state.dashboard.filters
export const selectSort = (state: RootState) => state.dashboard.sort
export const selectRole = (state: RootState) => state.dashboard.role
export const selectIsLoading = (state: RootState) => state.dashboard.isLoading

export const selectFilteredTransactions = createSelector(
  [selectTransactions, selectFilters],
  (transactions, filters): Transaction[] => {
    return transactions.filter(txn => {
      if (filters.category !== 'all' && txn.category !== filters.category) return false
      if (filters.status !== 'all' && txn.status !== filters.status) return false
      if (filters.dateFrom && txn.date < filters.dateFrom) return false
      if (filters.dateTo && txn.date > filters.dateTo) return false
      if (filters.search) {
        const search = filters.search.toLowerCase()
        const matchesDescription = txn.description.toLowerCase().includes(search)
        const matchesCategory = txn.category.toLowerCase().includes(search)
        const matchesAmount = Math.abs(txn.amount).toString().includes(search)
        if (!matchesDescription && !matchesCategory && !matchesAmount) return false
      }
      return true
    })
  }
)

export const selectSortedTransactions = createSelector(
  [selectFilteredTransactions, selectSort],
  (transactions, sort): Transaction[] => {
    const sorted = [...transactions]
    sorted.sort((a, b) => {
      let comparison = 0
      switch (sort.field) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
      }
      return sort.order === 'asc' ? comparison : -comparison
    })
    return sorted
  }
)

export const selectSummary = createSelector(
  [selectTransactions],
  (transactions) => {
    const completedTransactions = transactions.filter(t => t.status === 'completed')
    const income = completedTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
    const expenses = completedTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const balance = income - expenses
    const pending = transactions.filter(t => t.status === 'pending').length

    return { balance, income, expenses, pending }
  }
)

export const selectCategoryTotals = createSelector(
  [selectTransactions],
  (transactions): CategoryTotal[] => {
    const totals: Record<string, CategoryTotal> = {}
    
    transactions
      .filter(t => t.amount < 0 && t.status === 'completed')
      .forEach(t => {
        if (!totals[t.category]) {
          totals[t.category] = { category: t.category, total: 0, count: 0 }
        }
        totals[t.category].total += Math.abs(t.amount)
        totals[t.category].count += 1
      })

    return Object.values(totals).sort((a, b) => b.total - a.total)
  }
)

export const selectBalanceTrend = createSelector(
  [selectTransactions],
  (transactions): BalanceTrend[] => {
    const completedTransactions = transactions
      .filter(t => t.status === 'completed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const dailyTotals: Record<string, number> = {}
    completedTransactions.forEach(t => {
      if (!dailyTotals[t.date]) {
        dailyTotals[t.date] = 0
      }
      dailyTotals[t.date] += t.amount
    })

    const dates = Object.keys(dailyTotals).sort()
    let runningBalance = 10000 // Starting balance
    
    return dates.map(date => {
      runningBalance += dailyTotals[date]
      return { date, balance: Math.round(runningBalance * 100) / 100 }
    })
  }
)

export const selectInsights = createSelector(
  [selectCategoryTotals, selectSummary, selectTransactions],
  (categoryTotals, summary, transactions) => {
    const highestSpendingCategory = categoryTotals[0] || null
    const averageTransaction = transactions.length > 0
      ? transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transactions.length
      : 0
    const failedTransactions = transactions.filter(t => t.status === 'failed').length
    const savingsRate = summary.income > 0 
      ? ((summary.income - summary.expenses) / summary.income) * 100 
      : 0

    return {
      highestSpendingCategory,
      averageTransaction: Math.round(averageTransaction * 100) / 100,
      failedTransactions,
      savingsRate: Math.round(savingsRate * 10) / 10,
      totalTransactions: transactions.length
    }
  }
)
