<template>
  <div class="pa-4 development-page">
    <v-container fluid class="fill-height">
      <v-row justify="center" align="center" class="fill-height">
        
        <v-col cols="12" md="8" lg="6">
          <v-card class="animation-card" elevation="4" rounded="lg">
            <v-card-text class="pa-6">
              
              <div class="animation-container mb-6">
                <AnimationRobot :item="robotItems" />
              </div>

              
              <div class="text-center">
                <v-icon size="48" color="primary" class="mb-4">
                  mdi-cog-outline
                </v-icon>
                <h2 class="text-h5 mb-3 font-weight-bold">
                  ກຳລັງພັດທະນາ
                </h2>
                <p class="text-body-1 text-medium-emphasis mb-4">
                  ລໍຖ້າຂໍ້ມູນເງິນກູ້ ແລະ ຂໍ້ມູນຫຼັກຊັບ
                </p>
                <p class="text-body-2 text-medium-emphasis">
                  ເພື່ອນຳມາສ້າງເປັນບົດລາຍງານທີ່ສົມບູນແບບ
                </p>

               
                <v-progress-linear
                  indeterminate
                  color="primary"
                  class="mt-6"
                  rounded
                />

            
                <v-list class="mt-6 text-left" bg-color="transparent">
                  <v-list-item
                    v-for="feature in upcomingFeatures"
                    :key="feature.id"
                    class="px-0"
                  >
                    <template #prepend>
                      <v-icon :color="feature.color">{{ feature.icon }}</v-icon>
                    </template>
                    <v-list-item-title>{{ feature.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ feature.status }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const robotItems = ref<any[]>([
  { id: 1, name: 'Robot 1' },
  { id: 2, name: 'Robot 2' },
]);
const upcomingFeatures = ref([
  {
    id: 1,
    icon: 'mdi-currency-usd',
    title: 'ອັບໂຫຼດຂໍ້ມູນເງິນກູ້',
    status: 'ກຳລັງດຳເນີນການ',
    color: 'orange',
  },
  {
    id: 2,
    icon: 'mdi-shield-check',
    title: 'ອັບໂຫຼດຂໍ້ມູນຫຼັກຊັບ',
    status: 'ຍັງບໍ່ທັນເລີ່ມ',
    color: 'blue',
  },
  {
    id: 3,
    icon: 'mdi-file-document',
    title: 'ສ້າງບົດລາຍງານ',
    status: 'ຍັງບໍ່ທັນເລີ່ມ',
    color: 'grey',
  },
]);
</script>

<style scoped>
.development-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.fill-height {
  height: 100%;
}

.animation-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.animation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
}

.animation-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animation for text */
.text-h5, .text-body-1, .text-body-2 {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


@media (max-width: 768px) {
  .development-page {
    padding: 1rem !important;
  }
  
  .animation-card {
    margin: 1rem 0;
  }
}
</style>