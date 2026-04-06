import { TransactionCategory, TransactionStatus } from '@/types'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

export function formatCategory(category: TransactionCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

export function formatStatus(status: TransactionStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function getStatusColor(status: TransactionStatus): string {
  switch (status) {
    case 'completed':
      return 'text-emerald-600 dark:text-emerald-400'
    case 'pending':
      return 'text-amber-600 dark:text-amber-400'
    case 'failed':
      return 'text-red-600 dark:text-red-400'
  }
}

export function getCategoryColor(category: TransactionCategory): string {
  const colors: Record<TransactionCategory, string> = {
    food: 'hsl(var(--chart-1))',
    transport: 'hsl(var(--chart-2))',
    shopping: 'hsl(var(--chart-3))',
    utilities: 'hsl(var(--chart-4))',
    entertainment: 'hsl(var(--chart-5))',
    healthcare: 'hsl(220, 70%, 50%)',
    income: 'hsl(142, 76%, 36%)',
    other: 'hsl(0, 0%, 50%)'
  }
  return colors[category]
}
