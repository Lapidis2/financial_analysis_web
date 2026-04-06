'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppSelector } from '@/hooks/use-redux'
import { selectSummary, selectRole } from '@/store/selectors'
import { formatCurrency } from '@/utils/format'
import { TrendingUp, TrendingDown, Wallet, Clock } from 'lucide-react'

export function SummaryCards() {
  const summary = useAppSelector(selectSummary)
  const role = useAppSelector(selectRole)

  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(summary.balance),
      icon: Wallet,
      change: summary.balance >= 0 ? 'positive' : 'negative',
      adminOnly: false
    },
    {
      title: 'Income',
      value: formatCurrency(summary.income),
      icon: TrendingUp,
      change: 'positive',
      adminOnly: false
    },
    {
      title: 'Expenses',
      value: formatCurrency(summary.expenses),
      icon: TrendingDown,
      change: 'negative',
      adminOnly: false
    },
    {
      title: 'Pending',
      value: summary.pending.toString(),
      subtitle: 'transactions',
      icon: Clock,
      change: 'neutral',
      adminOnly: true
    }
  ]

  const visibleCards = cards.filter(card => !card.adminOnly || role === 'admin')

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {visibleCards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="py-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon 
                className={`h-4 w-4 ${
                  card.change === 'positive' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : card.change === 'negative' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-muted-foreground'
                }`} 
              />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-semibold tracking-tight">
                {card.value}
              </div>
              {card.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">
                  {card.subtitle}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
