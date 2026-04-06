'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppSelector } from '@/hooks/use-redux'
import { selectSortedTransactions, selectRole } from '@/store/selectors'
import { formatCurrency, formatDate, formatCategory, formatStatus, getStatusColor } from '@/utils/format'

export function TransactionCards() {
  const transactions = useAppSelector(selectSortedTransactions)
  const role = useAppSelector(selectRole)

  if (transactions.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="py-3">
          <CardContent className="py-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{transaction.description}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </span>
                  <Badge variant="secondary" className="font-normal text-xs">
                    {formatCategory(transaction.category)}
                  </Badge>
                  {role === 'admin' && (
                    <span className={`text-xs ${getStatusColor(transaction.status)}`}>
                      {formatStatus(transaction.status)}
                    </span>
                  )}
                </div>
              </div>
              <div className={`text-right font-semibold shrink-0 ${
                transaction.amount >= 0 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-foreground'
              }`}>
                {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
