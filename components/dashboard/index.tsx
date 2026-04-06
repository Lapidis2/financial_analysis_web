'use client'

import { useEffect, useState } from 'react'
import { DashboardHeader } from './dashboard-header'
import { SummaryCards } from './summary-cards'
import { BalanceChart } from './balance-chart'
import { SpendingChart } from './spending-chart'
import { InsightsPanel } from './insights-panel'
import { TransactionList } from '@/components/transactions/transaction-list'
import { DashboardSkeleton } from './dashboard-skeleton'

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <DashboardSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          <DashboardHeader />
          
          <SummaryCards />
          
          <div className="grid gap-6 lg:grid-cols-2">
            <BalanceChart />
            <SpendingChart />
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TransactionList />
            </div>
            <div>
              <InsightsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
