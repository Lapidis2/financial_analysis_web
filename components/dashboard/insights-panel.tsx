'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppSelector } from '@/hooks/use-redux'
import { selectInsights, selectRole } from '@/store/selectors'
import { formatCurrency, formatCategory } from '@/utils/format'
import { Lightbulb, AlertTriangle, TrendingUp, PieChart } from 'lucide-react'

export function InsightsPanel() {
  const insights = useAppSelector(selectInsights)
  const role = useAppSelector(selectRole)

  const insightItems = [
    {
      icon: PieChart,
      label: 'Top Spending Category',
      value: insights.highestSpendingCategory 
        ? `${formatCategory(insights.highestSpendingCategory.category)} (${formatCurrency(insights.highestSpendingCategory.total)})`
        : 'No data',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: TrendingUp,
      label: 'Savings Rate',
      value: `${insights.savingsRate}%`,
      color: insights.savingsRate >= 20 
        ? 'text-emerald-600 dark:text-emerald-400' 
        : 'text-amber-600 dark:text-amber-400'
    },
    {
      icon: Lightbulb,
      label: 'Average Transaction',
      value: formatCurrency(insights.averageTransaction),
      color: 'text-muted-foreground'
    },
    {
      icon: AlertTriangle,
      label: 'Failed Transactions',
      value: insights.failedTransactions.toString(),
      color: insights.failedTransactions > 0 
        ? 'text-red-600 dark:text-red-400' 
        : 'text-muted-foreground',
      adminOnly: true
    }
  ]

  const visibleInsights = insightItems.filter(item => !item.adminOnly || role === 'admin')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visibleInsights.map((item) => {
            const Icon = item.icon
            return (
              <div 
                key={item.label} 
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
