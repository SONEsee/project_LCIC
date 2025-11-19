<template>
  <div class="match-container">
    <div class="tabs-wrapper">
      <div class="tabs-header">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tabs-content">
        <div v-show="activeTab === 'find'" class="tab-panel">
          <MatchIndividualFindMatch />
        </div>

        <div v-show="activeTab === 'merge'" class="tab-panel">
          <MatchIndividualMerge />
        </div>

        <div v-show="activeTab === 'unmerge'" class="tab-panel">
          <MatchIndividualIndividualunMerge />
        </div>

        <div v-show="activeTab === 'group'" class="tab-panel">
          <MatchIndividualGroupMerge />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  middleware: 'auth',
  layout: 'backend',
});

type TabId = 'find' | 'merge' | 'unmerge' | 'group';

interface Tab {
  id: TabId;
  label: string;
}

const activeTab = ref<TabId>('find');

const tabs: Tab[] = [
  { id: 'find', label: 'Find Match' },
  { id: 'merge', label: 'Merge' },
  { id: 'unmerge', label: 'Unmerge' },
  { id: 'group', label: 'Group Merge' },
];
</script>

<style scoped>
.match-container {
  width: 100%;
  padding: 20px;
}

.tabs-wrapper {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  background: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

.tab-button {
  flex: 1;
  padding: 16px 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button:hover {
  background: #ebebeb;
  color: #333;
}

.tab-button.active {
  color: #1976d2;
  background: #ffffff;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #1976d2;
}

.tabs-content {
  padding: 24px;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .tabs-header {
    flex-wrap: wrap;
  }

  .tab-button {
    flex: 1 1 50%;
    padding: 12px 16px;
    font-size: 14px;
  }

  .tabs-content {
    padding: 16px;
  }
}
</style>