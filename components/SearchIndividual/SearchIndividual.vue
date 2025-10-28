<script setup lang="ts">
import { IndividualStore } from '~/stores/searchindividual';
import { useUserData } from "~/composables/useUserData";
import Swal from 'sweetalert2';

const individualStore = IndividualStore()
const { user, userId, isAdmin, isLoggedIn, userid } = useUserData();
const searchCustomerID = ref("");
const searchLcicID = ref("");
const searchType = ref(""); // ເພື່ອຕິດຕາມວ່າກໍາລັງຄົ້ນຫາແບບໃດ
const selectedItem = ref(null); // ເກັບຂໍ້ມູນທີ່ຖືກເລືອກ
const selectedIndex = ref(-1); // ເກັບ index ທີ່ຖືກເລືອກ

// ຟັງຊັນສໍາລັບເລືອກລາຍການ
const selectItem = (item: any, index: number) => {
    selectedItem.value = item;
    selectedIndex.value = index;
    
    // ສາມາດເພີ່ມ logic ເພີ່ມເຕີມຫຼັງຈາກເລືອກແລ້ວ
    console.log('Selected item:', item);
    
    // ຕົວຢ່າງ: ສະແດງ confirmation
    Swal.fire({
        icon: 'success',
        title: 'ເລືອກແລ້ວ',
        text: `ເລືອກລາຍການທີ່ ${index + 1} ແລ້ວ`,
        timer: 1500,
        showConfirmButton: false
    });
};

// ຟັງຊັນສໍາລັບລ້າງການເລືອກ
const clearSelection = () => {
    selectedItem.value = null;
    selectedIndex.value = -1;
};

// ຟັງຊັນສໍາລັບຄົ້ນຫາດ້ວຍ Customer ID
watch(searchCustomerID, async(newValue) => {
    if (!newValue.trim()) {
        individualStore.respons_data_reques = [];
        clearSelection(); // ລ້າງການເລືອກເມື່ອລ້າງການຄົ້ນຫາ
        return;
    }
    
    clearSelection(); // ລ້າງການເລືອກເກົ່າເມື່ອຄົ້ນຫາໃໝ່
    searchType.value = "customer";
    individualStore.reques_query.isLoading = true;
    
    try {
        individualStore.reques_query.query.customerid = newValue;
        individualStore.reques_query.query.lcic_id = ""; // ລຶບ lcic_id ເມື່ອຄົ້ນຫາດ້ວຍ customer ID
        await individualStore.searchListIndividual();
    } catch (error) {
        console.error('Search error:', error);
        Swal.fire({
            icon: "error",
            text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້",
            title: "ຜິດພາດ"
        });
    } finally {
        individualStore.reques_query.isLoading = false;
    }
});

// ຟັງຊັນສໍາລັບຄົ້ນຫາດ້ວຍ LCIC ID
watch(searchLcicID, async(newValue) => {
    if (!newValue.trim()) {
        individualStore.respons_data_reques = [];
        clearSelection(); // ລ້າງການເລືອກເມື່ອລ້າງການຄົ້ນຫາ
        return;
    }
    
    clearSelection(); // ລ້າງການເລືອກເກົ່າເມື່ອຄົ້ນຫາໃໝ່
    searchType.value = "lcic";
    individualStore.reques_query.isLoading = true;
    
    try {
        individualStore.reques_query.query.lcic_id = newValue;
        individualStore.reques_query.query.customerid = ""; // ລຶບ customer ID ເມື່ອຄົ້ນຫາດ້ວຍ LCIC ID
        await individualStore.searchListIndividual();
    } catch (error) {
        console.error('Search error:', error);
        Swal.fire({
            icon: "error",
            text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້",
            title: "ຜິດພາດ"
        });
    } finally {
        individualStore.reques_query.isLoading = false;
    }
});

// ຈັດການຂໍ້ມູນທີ່ໄດ້ຮັບມາ
const dataReques = computed(() => {
    const data = individualStore.respons_data_reques;
    if (Array.isArray(data)) {
        return data;
    }
    if (data && typeof data === "object") {
        return [data];
    }
    return [];
});

// ກວດສອບຜົນການຄົ້ນຫາ
const searchResults = computed(() => {
    const results = dataReques.value;
    const hasResults = results && results.length > 0;
    const isSearching = individualStore.reques_query.isLoading;
    
    // ຖ້າຍັງບໍ່ໄດ້ຄົ້ນຫາຫຍັງ
    if (!searchCustomerID.value && !searchLcicID.value) {
        return {
            hasData: false,
            message: "",
            showResults: false,
            filteredResults: []
        };
    }
    
    // ຖ້າກໍາລັງໂຫລດ
    if (isSearching) {
        return {
            hasData: false,
            message: "ກໍາລັງຄົ້ນຫາ...",
            showResults: false,
            filteredResults: []
        };
    }
    
    // ຖ້າບໍ່ມີຜົນການຄົ້ນຫາ
    if (!hasResults) {
        return {
            hasData: false,
            message: "ຍັງບໍ່ມີຂໍ້ມູນຜູ້ໃຊ້ນີ້",
            showResults: false,
            filteredResults: []
        };
    }
    
    // ສໍາລັບການຄົ້ນຫາດ້ວຍ LCIC ID
    if (searchType.value === "lcic") {
        // ກວດສອບ bnk_code
        const matchingBankResults = results.filter(item => item.bnk_code === userId.value);
        
        if (matchingBankResults.length > 0) {
            // ມີຂໍ້ມູນທີ່ bnk_code ຕົງກັນ
            return {
                hasData: true,
                message: "",
                showResults: true,
                filteredResults: matchingBankResults
            };
        } else {
            // ບໍ່ມີຂໍ້ມູນທີ່ bnk_code ຟົງກັນ - ສະແດງລາຍການທຳອິດ
            return {
                hasData: true,
                message: "ຍັງບໍ່ມີປະຫວັດກັບທະນາຄານຂອງທ່ານ",
                showResults: true,
                filteredResults: [results[0]] // ສະແດງແຕ່ລາຍການທຳອິດ
            };
        }
    }
    
    // ສໍາລັບການຄົ້ນຫາດ້ວຍ Customer ID (ສະແດງທຸກຢ່າງ)
    return {
        hasData: true,
        message: "",
        showResults: true,
        filteredResults: results
    };
});

// ຟັງຊັນສໍາລັບຈັດການກັບລາຍການທີ່ເລືອກ
const handleSelectedItem = () => {
    if (selectedItem.value) {
        // ທີ່ນີ້ສາມາດເພີ່ມ logic ທີ່ຕ້ອງການເມື່ອກົດປຸ່ມ "ດໍາເນີນການ"
        // ເຊັ່ນ: ນໍາທາງໄປໜ້າອື່ນ, ເກັບຂໍ້ມູນ, ສົ່ງ API, ແລະອື່ນໆ
        
        console.log('Processing selected item:', selectedItem.value);
        
        Swal.fire({
            icon: 'success',
            title: 'ສໍາເລັດ',
            text: 'ດໍາເນີນການກັບຂໍ້ມູນທີ່ເລືອກແລ້ວ',
            confirmButtonText: 'ຕົກລົງ'
        });
        
        // ຕົວຢ່າງ: emit event ຫຼື callback
        // emit('itemSelected', selectedItem.value);
    }
};

onMounted(() => {
    individualStore.reques_query.query.bnk_code = userId.value;
    // ບໍ່ຕ້ອງເອີ້ນ searchListIndividual() ທັນທີ ໃຫ້ລໍຖ້າຜູ້ໃຊ້ປອ້ນຂໍ້ມູນກ່ອນ
});
</script>

<template>
    <div class="search-container">
        <!-- ຟອມຄົ້ນຫາ -->
        <div class="search-form">
            <v-text-field 
                clearable 
                label="Customer ID" 
                variant="outlined" 
                v-model="searchCustomerID"
                :disabled="!!searchLcicID"
                placeholder="ປອ້ນ Customer ID"
            ></v-text-field>
            
            <div class="text-center my-2">
                <span class="text-grey">ຫຼື</span>
            </div>
            
            <v-text-field 
                clearable 
                label="LCIC ID" 
                variant="outlined" 
                v-model="searchLcicID"
                :disabled="!!searchCustomerID"
                placeholder="ປອ້ນ LCIC ID"
            ></v-text-field>
        </div>

        <!-- ສະແດງຜົນການຄົ້ນຫາ -->
        <div class="search-results mt-4">
            <!-- ຂໍ້ຄວາມເມື່ອບໍ່ມີຂໍ້ມູນ -->
            <v-alert 
                v-if="!searchResults.hasData && searchResults.message" 
                :type="individualStore.reques_query.isLoading ? 'info' : 'warning'"
                variant="tonal"
                class="mb-4"
            >
                {{ searchResults.message }}
            </v-alert>

            <!-- ຂໍ້ຄວາມແຈ້ງເຕືອນສໍາລັບ LCIC ID -->
            <v-alert 
                v-if="searchResults.hasData && searchResults.message && searchType === 'lcic'"
                type="info"
                variant="tonal"
                class="mb-4"
            >
                {{ searchResults.message }}
            </v-alert>

            <!-- ສະແດງຜົນຂໍ້ມູນແບບ List ທີ່ກົດເລືອກໄດ້ -->
            <div v-if="searchResults.showResults">
                <h3 class="mb-3">ຜົນການຄົ້ນຫາ ({{ searchResults.filteredResults.length }} ລາຍການ)</h3>
                
                <!-- ສະແດງລາຍການທີ່ເລືອກແລ້ວ -->
                <v-alert 
                    v-if="selectedItem" 
                    type="info" 
                    variant="tonal" 
                    class="mb-4"
                    closable
                    @click:close="clearSelection"
                >
                    <strong>ເລືອກລາຍການທີ່:</strong> {{ selectedIndex + 1 }}
                </v-alert>
                
                <!-- ລາຍການທີ່ສາມາດກົດເລືອກໄດ້ -->
                <v-list class="border rounded">
                    <v-list-item
                        v-for="(item, index) in searchResults.filteredResults" 
                        :key="index"
                        :class="{ 'bg-primary-lighten-4': selectedIndex === index }"
                        @click="selectItem(item, index)"
                        :ripple="true"
                        :active="selectedIndex === index"
                    >
                        <template v-slot:prepend>
                            <v-icon 
                                :color="selectedIndex === index ? 'primary' : 'grey'"
                                :icon="selectedIndex === index ? 'mdi-check-circle' : 'mdi-circle-outline'"
                            ></v-icon>
                        </template>
                        
                        <v-list-item-title>
                            <strong>ລາຍການທີ່ {{ index + 1 }}</strong>
                        </v-list-item-title>
                        
                        <v-list-item-subtitle>
                            <!-- ສະແດງຂໍ້ມູນສໍາຄັນບາງສ່ວນ -->
                            <div class="text-caption">
                                <span v-if="item.customerid"><strong>Customer ID:</strong> {{ item.customerid }}</span>
                                <span v-if="item.lcic_id" class="ml-3"><strong>LCIC ID:</strong> {{ item.lcic_id }}</span>
                                <span v-if="item.bnk_code" class="ml-3"><strong>Bank Code:</strong> {{ item.bnk_code }}</span>
                            </div>
                        </v-list-item-subtitle>
                        
                        <template v-slot:append>
                            <v-btn
                                icon="mdi-chevron-right"
                                variant="text"
                                size="small"
                                color="primary"
                            ></v-btn>
                        </template>
                    </v-list-item>
                </v-list>

                <!-- ສະແດງຂໍ້ມູນລະອຽດຂອງລາຍການທີ່ເລືອກ -->
                <v-card 
                    v-if="selectedItem" 
                    class="mt-4" 
                    variant="outlined"
                    elevation="2"
                >
                    <v-card-title class="bg-primary-lighten-5">
                        <v-icon icon="mdi-information-outline" class="mr-2"></v-icon>
                        ຂໍ້ມູນລະອຽດລາຍການທີ່ເລືອກ
                    </v-card-title>
                    
                    <v-card-text>
                        <pre class="text-body-2">{{ selectedItem }}</pre>
                    </v-card-text>
                    
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn 
                            color="primary" 
                            variant="elevated"
                            @click="handleSelectedItem"
                        >
                            ດໍາເນີນການ
                        </v-btn>
                        <v-btn 
                            color="grey" 
                            variant="text"
                            @click="clearSelection"
                        >
                            ຍົກເລີກ
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>

            <!-- ສໍາລັບ debugging (ສາມາດລຶບອອກໄດ້) -->
            <!-- <div class="mt-4" v-if="searchResults.showResults">
                <h4>ຂໍ້ມູນແບບເຕັມ (Debug):</h4>
                <pre>{{ dataReques }}</pre>
            </div> -->
        </div>
    </div>
</template>

<style scoped>
.search-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.search-form {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.search-results {
    min-height: 100px;
}

/* ການ styling ສໍາລັບ list items */
.v-list-item {
    border-bottom: 1px solid #e0e0e0;
    transition: all 0.3s ease;
    cursor: pointer;
}

.v-list-item:hover {
    background-color: #f5f5f5 !important;
}

.v-list-item:last-child {
    border-bottom: none;
}

.v-list-item.v-list-item--active {
    background-color: #e3f2fd !important;
}

/* ການ styling ສໍາລັບຂໍ້ມູນ pre */
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.4;
}

/* Animation ສໍາລັບການເລືອກ */
.bg-primary-lighten-4 {
    animation: pulse 0.3s ease-in-out;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
}
</style>