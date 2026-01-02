<script setup lang="ts">
import { ref } from 'vue'
import ChatInterface from './components/ChatInterface.vue'
import StatsPanel from './components/StatsPanel.vue'
import SettingsDialog from './components/SettingsDialog.vue'
import Button from 'primevue/button'
import Toolbar from 'primevue/toolbar'

const showSettings = ref(false)
</script>

<template>
  <div class="app-container">
    <Toolbar class="app-toolbar">
      <template #start>
        <div class="toolbar-brand">
          <i class="pi pi-clock text-3xl"></i>
          <div class="brand-text">
            <h1>FreeTime Manager</h1>
            <p>AI-Powered Time Management</p>
          </div>
        </div>
      </template>
      <template #end>
        <Button
          icon="pi pi-cog"
          label="Settings"
          text
          @click="showSettings = true"
        />
      </template>
    </Toolbar>

    <div class="app-content">
      <div class="content-grid">
        <div class="chat-section">
          <ChatInterface />
        </div>
        <div class="stats-section">
          <StatsPanel />
        </div>
      </div>
    </div>

    <SettingsDialog v-model:visible="showSettings" />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--surface-ground);
}

.app-toolbar {
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  padding: 1rem 2rem;
}

.toolbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-text h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.brand-text p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.app-content {
  flex: 1;
  padding: 2rem;
  overflow: auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
}

.chat-section,
.stats-section {
  display: flex;
  flex-direction: column;
}

.text-3xl {
  font-size: 1.875rem;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
