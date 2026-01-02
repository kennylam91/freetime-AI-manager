import type { TimeCategory, TimeEntry, TimeStats } from '../types'

const CATEGORIES_KEY = 'freetime_categories'
const ENTRIES_KEY = 'freetime_entries'

export class TimeService {
  static getCategories(): TimeCategory[] {
    const stored = localStorage.getItem(CATEGORIES_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    
    // Default categories
    const defaults: TimeCategory[] = [
      { id: '1', name: 'Learning', color: '#3B82F6', allocatedMinutes: 120 },
      { id: '2', name: 'Health', color: '#10B981', allocatedMinutes: 90 },
      { id: '3', name: 'Entertainment', color: '#F59E0B', allocatedMinutes: 60 },
      { id: '4', name: 'Social', color: '#8B5CF6', allocatedMinutes: 60 },
      { id: '5', name: 'Creative', color: '#EC4899', allocatedMinutes: 60 }
    ]
    this.saveCategories(defaults)
    return defaults
  }

  static saveCategories(categories: TimeCategory[]): void {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  }

  static getEntries(): TimeEntry[] {
    const stored = localStorage.getItem(ENTRIES_KEY)
    if (stored) {
      const entries = JSON.parse(stored)
      return entries.map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) }))
    }
    return []
  }

  static saveEntries(entries: TimeEntry[]): void {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
  }

  static addEntry(entry: Omit<TimeEntry, 'id'>): TimeEntry {
    const entries = this.getEntries()
    const newEntry: TimeEntry = {
      ...entry,
      id: Date.now().toString()
    }
    entries.push(newEntry)
    this.saveEntries(entries)
    return newEntry
  }

  static updateCategory(id: string, updates: Partial<Omit<TimeCategory, 'id'>>): void {
    const categories = this.getCategories()
    const index = categories.findIndex(c => c.id === id)
    if (index !== -1) {
      const current = categories[index]!
      categories[index] = {
        id: current.id,
        name: updates.name ?? current.name,
        color: updates.color ?? current.color,
        allocatedMinutes: updates.allocatedMinutes ?? current.allocatedMinutes
      }
      this.saveCategories(categories)
    }
  }

  static addCategory(category: Omit<TimeCategory, 'id'>): TimeCategory {
    const categories = this.getCategories()
    const newCategory: TimeCategory = {
      ...category,
      id: Date.now().toString()
    }
    categories.push(newCategory)
    this.saveCategories(categories)
    return newCategory
  }

  static getStats(): TimeStats {
    const categories = this.getCategories()
    const entries = this.getEntries()
    
    const totalAllocated = categories.reduce((sum, c) => sum + c.allocatedMinutes, 0)
    const totalSpent = entries.reduce((sum, e) => sum + e.minutes, 0)
    
    const byCategory = categories.map(category => {
      const spent = entries
        .filter(e => e.categoryId === category.id)
        .reduce((sum, e) => sum + e.minutes, 0)
      
      return {
        categoryId: category.id,
        allocated: category.allocatedMinutes,
        spent,
        remaining: category.allocatedMinutes - spent
      }
    })
    
    return {
      totalAllocated,
      totalSpent,
      remaining: totalAllocated - totalSpent,
      byCategory
    }
  }
}
