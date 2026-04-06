'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { selectRole } from '@/store/selectors'
import { setRole } from '@/store/dashboard-slice'
import { UserRole } from '@/types'
import { Moon, Sun, User, Shield } from 'lucide-react'

export function DashboardHeader() {
  const dispatch = useAppDispatch()
  const role = useAppSelector(selectRole)
  const { theme, setTheme } = useTheme()

  const handleRoleChange = (value: string) => {
    dispatch(setRole(value as UserRole))
  }

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Financial Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your transactions and analyze spending patterns
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Select value={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </div>
            </SelectItem>
            <SelectItem value="viewer">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Viewer
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  )
}
