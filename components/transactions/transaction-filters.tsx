'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { selectFilters, selectRole } from '@/store/selectors'
import { setFilter, resetFilters } from '@/store/dashboard-slice'
import { TransactionCategory, TransactionStatus } from '@/types'
import { Search, X } from 'lucide-react'

const categories: { value: TransactionCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'income', label: 'Income' },
  { value: 'other', label: 'Other' },
]

const statuses: { value: TransactionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
]

export function TransactionFilters() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectFilters)
  const role = useAppSelector(selectRole)

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.status !== 'all' || 
    filters.dateFrom || 
    filters.dateTo || 
    filters.search

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter({ search: e.target.value }))
  }

  const handleCategoryChange = (value: string) => {
    dispatch(setFilter({ category: value as TransactionCategory | 'all' }))
  }

  const handleStatusChange = (value: string) => {
    dispatch(setFilter({ status: value as TransactionStatus | 'all' }))
  }

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter({ dateFrom: e.target.value }))
  }

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter({ dateTo: e.target.value }))
  }

  const handleReset = () => {
    dispatch(resetFilters())
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="shrink-0"
          >
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {role === 'admin' && (
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Input
          type="date"
          value={filters.dateFrom}
          onChange={handleDateFromChange}
          className="w-[150px]"
          placeholder="From"
        />
        <Input
          type="date"
          value={filters.dateTo}
          onChange={handleDateToChange}
          className="w-[150px]"
          placeholder="To"
        />
      </div>
    </div>
  )
}
