<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useFreeTimeManager } from '../composables/useFreeTimeManager'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ScrollPanel from 'primevue/scrollpanel'

const { messages, isProcessing, sendMessage } = useFreeTimeManager()
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement>()

async function handleSend() {
  if (!inputMessage.value.trim()) return
  
  const message = inputMessage.value
  inputMessage.value = ''
  
  await sendMessage(message)
  
  // Scroll to bottom
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<template>
  <Card class="chat-card">
    <template #title>
      <div class="flex items-center gap-2">
        <i class="pi pi-comments text-2xl"></i>
        <span>Chat Assistant</span>
      </div>
    </template>
    <template #content>
      <div class="chat-container">
        <ScrollPanel ref="messagesContainer" class="messages-panel" style="width: 100%; height: 500px">
          <div class="messages-list">
            <div
              v-for="message in messages"
              :key="message.id"
              :class="['message', message.role]"
            >
              <div class="message-header">
                <i :class="message.role === 'user' ? 'pi pi-user' : 'pi pi-robot'"></i>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>
            <div v-if="isProcessing" class="message assistant processing">
              <div class="message-header">
                <i class="pi pi-robot"></i>
                <span class="message-time">Now</span>
              </div>
              <div class="message-content">
                <i class="pi pi-spin pi-spinner"></i> Thinking...
              </div>
            </div>
          </div>
        </ScrollPanel>
        
        <div class="input-container">
          <InputText
            v-model="inputMessage"
            placeholder="Type your message... (e.g., 'allocate 60 minutes to Learning')"
            class="flex-1"
            :disabled="isProcessing"
            @keypress="handleKeyPress"
          />
          <Button
            icon="pi pi-send"
            @click="handleSend"
            :disabled="!inputMessage.trim() || isProcessing"
            :loading="isProcessing"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.chat-card {
  width: 100%;
  height: 100%;
}

.chat-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.messages-panel {
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  background: var(--surface-ground);
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 80%;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  align-self: flex-end;
}

.message.assistant {
  align-self: flex-start;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.message.user .message-header {
  flex-direction: row-reverse;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message.user .message-content {
  background: var(--primary-color);
  color: var(--primary-color-text);
  border-bottom-right-radius: 0.25rem;
}

.message.assistant .message-content {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-bottom-left-radius: 0.25rem;
}

.message.processing .message-content {
  opacity: 0.7;
}

.message-time {
  font-size: 0.75rem;
}

.input-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.flex-1 {
  flex: 1;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-2 {
  gap: 0.5rem;
}

.text-2xl {
  font-size: 1.5rem;
}
</style>
