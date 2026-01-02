export interface TimeCategory {
  id: string
  name: string
  color: string
  allocatedMinutes: number
}

export interface TimeEntry {
  id: string
  categoryId: string
  minutes: number
  description: string
  timestamp: Date
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface TimeStats {
  totalAllocated: number
  totalSpent: number
  remaining: number
  byCategory: {
    categoryId: string
    allocated: number
    spent: number
    remaining: number
  }[]
}
