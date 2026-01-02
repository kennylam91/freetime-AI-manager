import type { ChatMessage } from '../types'
import { TimeService } from './timeService'

export interface LLMConfig {
  apiKey: string
  model: string
  baseURL: string
}

export class LLMService {
  private config: LLMConfig

  constructor(config: LLMConfig) {
    this.config = config
  }

  async sendMessage(messages: ChatMessage[], userMessage: string): Promise<string> {
    try {
      // Build context with current time stats
      const stats = TimeService.getStats()
      const categories = TimeService.getCategories()
      
      const systemContext = this.buildSystemContext(categories, stats)
      
      const apiMessages = [
        { role: 'system', content: systemContext },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ]

      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 500
        })
      })

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('Error calling LLM API:', error)
      return this.getFallbackResponse(userMessage)
    }
  }

  private buildSystemContext(categories: any[], stats: any): string {
    const categoryList = categories.map(c => 
      `- ${c.name}: ${c.allocatedMinutes} minutes allocated`
    ).join('\n')
    
    const spendingList = stats.byCategory.map((s: any) => {
      const cat = categories.find(c => c.id === s.categoryId)
      return `- ${cat?.name}: ${s.spent}/${s.allocated} minutes used (${s.remaining} remaining)`
    }).join('\n')

    return `You are a helpful freetime management assistant. You help users manage their free time across different categories.

Current time allocation:
${categoryList}

Current spending:
${spendingList}

Total: ${stats.totalSpent}/${stats.totalAllocated} minutes used (${stats.remaining} remaining)

You can help users:
1. Allocate time to categories (use format: "allocate X minutes to [category]")
2. Log time spent (use format: "log X minutes for [category] - [description]")
3. Check remaining time
4. View spending by category
5. Add new categories

Provide clear, concise responses. When users want to perform actions, acknowledge what will be done.`
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('remaining') || lowerMessage.includes('left')) {
      const stats = TimeService.getStats()
      return `You have ${stats.remaining} minutes of free time remaining out of ${stats.totalAllocated} minutes allocated.`
    }
    
    if (lowerMessage.includes('spending') || lowerMessage.includes('allocation')) {
      const stats = TimeService.getStats()
      const categories = TimeService.getCategories()
      const breakdown = stats.byCategory.map(s => {
        const cat = categories.find(c => c.id === s.categoryId)
        return `${cat?.name}: ${s.spent}/${s.allocated} minutes`
      }).join(', ')
      return `Your current spending: ${breakdown}`
    }
    
    return "I'm here to help you manage your free time. You can ask me to allocate time, log activities, or check your remaining time. Please make sure to configure the LLM API settings."
  }
}
