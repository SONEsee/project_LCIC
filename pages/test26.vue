<!-- pages/matching/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Customer Matching</h1>
        <p class="mt-2 text-sm text-gray-600">
          Review and confirm customer matches across banks
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Statistics Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Records"
          :value="statistics.total_records"
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Matched"
          :value="statistics.matched_records"
          icon="✓"
          color="green"
        />
        <StatCard
          title="Pending Review"
          :value="statistics.pending_review"
          icon="⏳"
          color="yellow"
        />
        <StatCard
          title="Match Rate"
          :value="`${matchRate}%`"
          icon="📈"
          color="purple"
        />
      </div>

      <!-- Controls -->
      <div class="bg-white rounded-lg shadow mb-6 p-6">
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div class="flex gap-4 items-center">
            <label class="text-sm font-medium text-gray-700">
              Min Score:
            </label>
            <input
              v-model.number="minScore"
              type="number"
              min="0"
              max="100"
              class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              @click="loadMatchGroups"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>
          
          <div class="text-sm text-gray-600">
            Showing {{ matchGroups.length }} groups
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading match groups...</p>
      </div>

      <!-- Match Groups -->
      <div v-else-if="matchGroups.length > 0" class="space-y-6">
        <MatchGroup
          v-for="group in matchGroups"
          :key="group.group_id"
          :group="group"
          @confirm="handleConfirm"
          @reject="handleReject"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow p-12 text-center">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          All Caught Up!
        </h3>
        <p class="text-gray-600">
          No match groups found with current criteria.
          Try adjusting the minimum score.
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="matchGroups.length > 0" class="mt-8 flex justify-center gap-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>
        <span class="px-4 py-2 text-gray-700">
          Page {{ currentPage }}
        </span>
        <button
          @click="nextPage"
          :disabled="matchGroups.length < pageSize"
          class="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Success Toast -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md"
        :class="toast.type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">{{ toast.type === 'success' ? '✓' : '✗' }}</span>
          <p class="text-sm text-gray-900">{{ toast.message }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const matchingApi = useMatchingApi()

// State
const statistics = ref({
  total_records: 0,
  matched_records: 0,
  unmatched_records: 0,
  manual_matches: 0,
  auto_matches: 0,
  pending_review: 0,
})

const matchGroups = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const minScore = ref(80)

const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

// Computed
const matchRate = computed(() => {
  if (statistics.value.total_records === 0) return 0
  return Math.round(
    (statistics.value.matched_records / statistics.value.total_records) * 100
  )
})

// Methods
const loadStatistics = async () => {
  try {
    const data = await matchingApi.getStatistics()
    statistics.value = data
  } catch (error) {
    console.error('Failed to load statistics:', error)
  }
}

const loadMatchGroups = async () => {
  loading.value = true
  try {
    const data = await matchingApi.getMatchGroups(
      currentPage.value,
      pageSize.value,
      minScore.value
    )
    matchGroups.value = data.groups || []
  } catch (error) {
    console.error('Failed to load match groups:', error)
    showToast('Failed to load match groups', 'error')
  } finally {
    loading.value = false
  }
}

const handleConfirm = async (data: any) => {
  try {
    await matchingApi.confirmMatch(data)
    showToast('Match confirmed successfully!', 'success')
    
    // Reload data
    await Promise.all([loadStatistics(), loadMatchGroups()])
  } catch (error) {
    console.error('Failed to confirm match:', error)
    showToast('Failed to confirm match', 'error')
  }
}

const handleReject = async (data: any) => {
  try {
    await matchingApi.rejectMatch(data)
    showToast('Match rejected successfully!', 'success')
    
    // Reload data
    await loadMatchGroups()
  } catch (error) {
    console.error('Failed to reject match:', error)
    showToast('Failed to reject match', 'error')
  }
}

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const nextPage = () => {
  currentPage.value++
  loadMatchGroups()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadMatchGroups()
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([loadStatistics(), loadMatchGroups()])
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>