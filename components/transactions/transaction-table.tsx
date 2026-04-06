'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { selectSortedTransactions, selectSort, selectRole } from '@/store/selectors'
import { setSort } from '@/store/dashboard-slice'
import { SortField } from '@/types'
import { formatCurrency, formatDate, formatCategory, formatStatus, getStatusColor } from '@/utils/format'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

export function TransactionTable() {
  const dispatch = useAppDispatch()
  const transactions = useAppSelector(selectSortedTransactions)
  const sort = useAppSelector(selectSort)
  const role = useAppSelector(selectRole)

  const handleSort = (field: SortField) => {
    dispatch(setSort({
      field,
      order: sort.field === field && sort.order === 'desc' ? 'asc' : 'desc'
    }))
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) return <ArrowUpDown className="h-4 w-4" />
    return sort.order === 'asc' 
      ? <ArrowUp className="h-4 w-4" /> 
      : <ArrowDown className="h-4 w-4" />
  }

  if (transactions.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 font-medium"
                onClick={() => handleSort('date')}
              >
                Date
                <SortIcon field="date" />
              </Button>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 font-medium"
                onClick={() => handleSort('category')}
              >
                Category
                <SortIcon field="category" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                className="-mr-3 h-8 font-medium"
                onClick={() => handleSort('amount')}
              >
                Amount
                <SortIcon field="amount" />
              </Button>
            </TableHead>
            {role === 'admin' && <TableHead>Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="text-muted-foreground">
                {formatDate(transaction.date)}
              </TableCell>
              <TableCell className="font-medium">
                {transaction.description}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {formatCategory(transaction.category)}
                </Badge>
              </TableCell>
              <TableCell className={`text-right font-medium ${
                transaction.amount >= 0 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-foreground'
              }`}>
                {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
              </TableCell>
              {role === 'admin' && (
                <TableCell>
                  <span className={`text-sm ${getStatusColor(transaction.status)}`}>
                    {formatStatus(transaction.status)}
                  </span>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
