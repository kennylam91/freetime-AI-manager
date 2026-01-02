<script setup lang="ts">
import { ref } from 'vue'
import { useFreeTimeManager } from '../composables/useFreeTimeManager'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const { llmConfig, setLLMConfig } = useFreeTimeManager()

const apiKey = ref(llmConfig.value?.apiKey || '')
const model = ref(llmConfig.value?.model || 'llama-3.3-70b-versatile')
const baseURL = ref(llmConfig.value?.baseURL || 'https://api.groq.com/openai/v1')

function handleSave() {
  setLLMConfig({
    apiKey: apiKey.value,
    model: model.value,
    baseURL: baseURL.value
  })
  emit('update:visible', false)
}

function handleClose() {
  emit('update:visible', false)
}
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="LLM API Settings"
    :style="{ width: '500px' }"
  >
    <div class="settings-content">
      <Message severity="info" :closable="false">
        Configure a free LLM API like Groq (groq.com) or HuggingFace. Get your API key from their website.
      </Message>

      <div class="field">
        <label for="baseURL">API Base URL</label>
        <InputText
          id="baseURL"
          v-model="baseURL"
          placeholder="https://api.groq.com/openai/v1"
          class="w-full"
        />
        <small>Default: Groq API endpoint</small>
      </div>

      <div class="field">
        <label for="model">Model Name</label>
        <InputText
          id="model"
          v-model="model"
          placeholder="llama-3.3-70b-versatile"
          class="w-full"
        />
        <small>Default: Llama 3.3 70B (Groq)</small>
      </div>

      <div class="field">
        <label for="apiKey">API Key</label>
        <InputText
          id="apiKey"
          v-model="apiKey"
          type="password"
          placeholder="Enter your API key"
          class="w-full"
        />
        <small>Your API key is stored locally in your browser</small>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button label="Cancel" text @click="handleClose" />
        <Button label="Save" @click="handleSave" />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.settings-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-weight: 600;
  font-size: 0.875rem;
}

.field small {
  color: var(--text-color-secondary);
  font-size: 0.75rem;
}

.w-full {
  width: 100%;
}

.dialog-footer {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
