import { ref, computed } from 'vue'
import type { ChatMessage, TimeCategory, TimeEntry } from '../types'
import { TimeService } from '../services/timeService'
import { LLMService, type LLMConfig } from '../services/llmService'

const messages = ref<ChatMessage[]>([])
const categories = ref<TimeCategory[]>([])
const entries = ref<TimeEntry[]>([])
const isProcessing = ref(false)
const llmConfig = ref<LLMConfig | null>(null)

export function useFreeTimeManager() {
  const llmService = computed(() => {
    if (!llmConfig.value) return null
    return new LLMService(llmConfig.value)
  })

  const stats = computed(() => TimeService.getStats())

  function loadData() {
    categories.value = TimeService.getCategories()
    entries.value = TimeService.getEntries()
  }

  function setLLMConfig(config: LLMConfig) {
    llmConfig.value = config
    localStorage.setItem('llm_config', JSON.stringify(config))
  }

  function loadLLMConfig() {
    const stored = localStorage.getItem('llm_config')
    if (stored) {
      llmConfig.value = JSON.parse(stored)
    }
  }

  async function sendMessage(content: string) {
    if (!content.trim() || isProcessing.value) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }
    messages.value.push(userMessage)

    isProcessing.value = true

    try {
      // Check if message contains an action
      const actionResult = processAction(content)
      
      // Get LLM response
      let response: string
      if (llmService.value) {
        response = await llmService.value.sendMessage(messages.value, content)
      } else {
        response = actionResult || "Please configure the LLM API settings to use the chat assistant."
      }

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      messages.value.push(assistantMessage)

      // Reload data after actions
      loadData()
    } catch (error) {
      console.error('Error processing message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date()
      }
      messages.value.push(errorMessage)
    } finally {
      isProcessing.value = false
    }
  }

  function processAction(content: string): string | null {
    // Allocate time: "allocate X minutes to [category]"
    const allocateMatch = content.match(/allocate\s+(\d+)\s+minutes?\s+to\s+(.+)/i)
    if (allocateMatch && allocateMatch[1] && allocateMatch[2]) {
      const minutes = parseInt(allocateMatch[1])
      const categoryName = allocateMatch[2].trim()
      const category = categories.value.find(c => c.name.toLowerCase() === categoryName.toLowerCase())
      
      if (category) {
        TimeService.updateCategory(category.id, { allocatedMinutes: category.allocatedMinutes + minutes })
        loadData()
        return `Added ${minutes} minutes to ${category.name}. Total allocation: ${category.allocatedMinutes + minutes} minutes.`
      } else {
        // Create new category
        const newCategory = TimeService.addCategory({
          name: categoryName,
          color: getRandomColor(),
          allocatedMinutes: minutes
        })
        loadData()
        return `Created new category "${newCategory.name}" with ${minutes} minutes allocated.`
      }
    }

    // Log time: "log X minutes for [category] - [description]"
    const logMatch = content.match(/log\s+(\d+)\s+minutes?\s+(?:for|to)\s+(.+?)(?:\s*-\s*(.+))?$/i)
    if (logMatch && logMatch[1] && logMatch[2]) {
      const minutes = parseInt(logMatch[1])
      const categoryName = logMatch[2].trim()
      const description = logMatch[3]?.trim() || 'Activity'
      
      const category = categories.value.find(c => c.name.toLowerCase() === categoryName.toLowerCase())
      
      if (category) {
        TimeService.addEntry({
          categoryId: category.id,
          minutes,
          description,
          timestamp: new Date()
        })
        loadData()
        return `Logged ${minutes} minutes for ${category.name}: ${description}`
      } else {
        return `Category "${categoryName}" not found. Available categories: ${categories.value.map(c => c.name).join(', ')}`
      }
    }

    return null
  }

  function getRandomColor(): string {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444', '#14B8A6', '#F97316']
    return colors[Math.floor(Math.random() * colors.length)] || '#3B82F6'
  }

  function clearChat() {
    messages.value = []
  }

  // Initialize
  loadData()
  loadLLMConfig()

  // Add welcome message
  if (messages.value.length === 0) {
    messages.value.push({
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your freetime management assistant. I can help you allocate time, log activities, and track your free time. Try asking me:\n\n• "Allocate 60 minutes to Learning"\n• "Log 30 minutes for Health - Morning workout"\n• "How much time do I have remaining?"\n• "Show my spending allocation"',
      timestamp: new Date()
    })
  }

  return {
    messages,
    categories,
    entries,
    stats,
    isProcessing,
    llmConfig,
    sendMessage,
    setLLMConfig,
    clearChat,
    loadData
  }
}
