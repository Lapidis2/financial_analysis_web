'use client'

import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { TransactionFilters } from './transaction-filters'
import { TransactionTable } from './transaction-table'
import { TransactionCards } from './transaction-cards'
import { useAppSelector } from '@/hooks/use-redux'
import { selectSortedTransactions, selectRole, selectFilters } from '@/store/selectors'
import { Download, FileText } from 'lucide-react'

function exportToCSV(transactions: ReturnType<typeof selectSortedTransactions>) {
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Status']
  const rows = transactions.map(t => [
    t.date,
    t.description,
    t.category,
    t.amount.toString(),
    t.status
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

export function TransactionList() {
  const transactions = useAppSelector(selectSortedTransactions)
  const role = useAppSelector(selectRole)
  const filters = useAppSelector(selectFilters)

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.status !== 'all' || 
    filters.dateFrom || 
    filters.dateTo || 
    filters.search

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        {role === 'admin' && transactions.length > 0 && (
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(transactions)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <TransactionFilters />
        
        {transactions.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText className="h-5 w-5" />
              </EmptyMedia>
              <EmptyTitle>
                {hasActiveFilters ? 'No matching transactions' : 'No transactions'}
              </EmptyTitle>
              <EmptyDescription>
                {hasActiveFilters 
                  ? 'Try adjusting your filters to see more results' 
                  : 'Transactions will appear here once added'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            {/* Desktop: Table view */}
            <div className="hidden md:block">
              <TransactionTable />
            </div>
            {/* Mobile: Card view */}
            <div className="md:hidden">
              <TransactionCards />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
