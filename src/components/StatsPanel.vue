<script setup lang="ts">
import { computed } from 'vue'
import { useFreeTimeManager } from '../composables/useFreeTimeManager'
import Card from 'primevue/card'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'

const { stats, categories } = useFreeTimeManager()

const overallProgress = computed(() => {
  if (stats.value.totalAllocated === 0) return 0
  return Math.round((stats.value.totalSpent / stats.value.totalAllocated) * 100)
})

function getCategoryName(categoryId: string): string {
  return categories.value.find(c => c.id === categoryId)?.name || 'Unknown'
}

function getCategoryColor(categoryId: string): string {
  return categories.value.find(c => c.id === categoryId)?.color || '#666'
}

function getCategoryProgress(stat: any): number {
  if (stat.allocated === 0) return 0
  return Math.round((stat.spent / stat.allocated) * 100)
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}
</script>

<template>
  <Card class="stats-card">
    <template #title>
      <div class="flex items-center gap-2">
        <i class="pi pi-chart-bar text-2xl"></i>
        <span>Time Statistics</span>
      </div>
    </template>
    <template #content>
      <div class="stats-container">
        <!-- Overall Progress -->
        <div class="stat-section">
          <div class="stat-header">
            <h3>Overall Progress</h3>
            <Tag :value="`${overallProgress}%`" :severity="overallProgress > 80 ? 'danger' : overallProgress > 50 ? 'warning' : 'success'" />
          </div>
          <ProgressBar :value="overallProgress" :showValue="false" />
          <div class="stat-details">
            <div class="stat-item">
              <span class="stat-label">Allocated:</span>
              <span class="stat-value">{{ formatMinutes(stats.totalAllocated) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Spent:</span>
              <span class="stat-value">{{ formatMinutes(stats.totalSpent) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Remaining:</span>
              <span class="stat-value" :class="stats.remaining < 0 ? 'text-danger' : 'text-success'">
                {{ formatMinutes(stats.remaining) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="stat-section">
          <h3>By Category</h3>
          <div class="categories-list">
            <div
              v-for="stat in stats.byCategory"
              :key="stat.categoryId"
              class="category-stat"
            >
              <div class="category-header">
                <div class="category-info">
                  <div
                    class="category-dot"
                    :style="{ backgroundColor: getCategoryColor(stat.categoryId) }"
                  ></div>
                  <span class="category-name">{{ getCategoryName(stat.categoryId) }}</span>
                </div>
                <Tag
                  :value="`${getCategoryProgress(stat)}%`"
                  :severity="getCategoryProgress(stat) > 80 ? 'danger' : getCategoryProgress(stat) > 50 ? 'warning' : 'success'"
                  :style="{ fontSize: '0.75rem' }"
                />
              </div>
              <ProgressBar :value="getCategoryProgress(stat)" :showValue="false" />
              <div class="category-details">
                <span class="detail-text">{{ formatMinutes(stat.spent) }} / {{ formatMinutes(stat.allocated) }}</span>
                <span class="detail-text" :class="stat.remaining < 0 ? 'text-danger' : ''">
                  {{ stat.remaining >= 0 ? '+' : '' }}{{ formatMinutes(stat.remaining) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.stats-card {
  width: 100%;
  height: 100%;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stat-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-header h3,
.stat-section h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.stat-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.category-name {
  font-weight: 500;
}

.category-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.detail-text {
  font-family: monospace;
}

.text-danger {
  color: var(--red-500);
}

.text-success {
  color: var(--green-500);
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
