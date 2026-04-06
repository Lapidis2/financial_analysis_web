import { Transaction, TransactionCategory, TransactionStatus } from '@/types'

const categories: TransactionCategory[] = ['food', 'transport', 'shopping', 'utilities', 'entertainment', 'healthcare', 'income', 'other']
const statuses: TransactionStatus[] = ['completed', 'pending', 'failed']

const descriptions: Record<TransactionCategory, string[]> = {
  food: ['Grocery Store', 'Restaurant Dinner', 'Coffee Shop', 'Food Delivery', 'Bakery Purchase'],
  transport: ['Uber Ride', 'Gas Station', 'Metro Card', 'Parking Fee', 'Car Service'],
  shopping: ['Amazon Purchase', 'Clothing Store', 'Electronics Shop', 'Home Depot', 'Online Retail'],
  utilities: ['Electric Bill', 'Water Bill', 'Internet Service', 'Phone Bill', 'Gas Bill'],
  entertainment: ['Netflix Subscription', 'Movie Tickets', 'Concert Tickets', 'Streaming Service', 'Gaming'],
  healthcare: ['Pharmacy', 'Doctor Visit', 'Gym Membership', 'Health Insurance', 'Dental Checkup'],
  income: ['Salary Deposit', 'Freelance Payment', 'Investment Return', 'Bonus Payment', 'Refund'],
  other: ['ATM Withdrawal', 'Bank Transfer', 'Misc Purchase', 'Service Fee', 'Other Payment']
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split('T')[0]
}

function randomAmount(category: TransactionCategory): number {
  if (category === 'income') {
    return Math.round((Math.random() * 4000 + 1000) * 100) / 100
  }
  const ranges: Record<TransactionCategory, [number, number]> = {
    food: [10, 200],
    transport: [5, 100],
    shopping: [20, 500],
    utilities: [50, 300],
    entertainment: [10, 150],
    healthcare: [20, 400],
    income: [1000, 5000],
    other: [10, 200]
  }
  const [min, max] = ranges[category]
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

export function generateMockTransactions(count: number = 50): Transaction[] {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 6)

  return Array.from({ length: count }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const descriptionList = descriptions[category]
    
    return {
      id: `txn-${i + 1}-${Date.now()}`,
      amount: category === 'income' ? randomAmount(category) : -randomAmount(category),
      category,
      date: randomDate(startDate, endDate),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      description: descriptionList[Math.floor(Math.random() * descriptionList.length)]
    }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
