<script setup lang="ts">
const items = [
  {
    message: "ການຈັດຊັ້ນໜີ້ຕາມເປົ້າໝາຍເງິນກູ້ຂອງບັນດາທະນາຄານ",
    url: "../backend/reportprint/Distribution_of_Loan_Class_By_Loan_Purpose_By_Bank",
  },
  {
    message: "ການຈັດຊັ້ນໜີ້ຕາມເປົ້າໝາຍເງິນກູ້ຂອງທົ່ວລະບົບທະນາຄານ",
    url: "../backend/Distribtion_Of_Loan_Class_By_Loan_Purpose_For_All_Banks",
  },
  {
    message: "ການຈັດຊັ້ນໜີ້ຕາມແຕ່ລະແຂວງຂອງບັນດາທະນາຄານ",
    url: "../backend/reportprint/Distribution_Of_Loan_Class_By_Province_By_Bank",
  },
  {
    message: "ການຈັດຊັ້ນໜີ້ຕາມແຕ່ລະແຂວງຂອງທົວລະບົບທະນາຄານ",
    url: "..//backend/reportprint/Distribution_Of_Loan_Class_By_Province_For_All_Banks",
  },
  {
    message: "ການວິເຄາະລວມຂອງຈຳນວເງິນກູ້ຕາມການຈັດຊັ້ນໜີ້",
    url: "../backend/reportprint/Portfolio_Analysis_Total_Loan_Count_Per_Loan_Class",
  },
  {
    message: "ການວິເຄາະລວມຂອງຈຳນວນລວມເງິນຄ່າເງິນກູ້ຕາມການຈັດຊັ້ນໜີ້",
    url: "../backend/reportprint/Portfolio_Analysis_Total_Loan_Value_Per_Loan_Class",
  },
  {
    message: "ບົດລາຍງານແຮຄ່າເສື່ອມມູນຄ່າໜີ້ຕອ້ງຮັບທວງຍາກຂອງແຕ່ລະທະນາຄານ",
    url: "../backend/reportprint/Provision_Requirement_By_Bank",
  },
  {
    message: "ບົດລາຍງານເງິນແຮຄ່າເສື່ອມມູນຄ່າໜີ້ຕອ້ງຮັບທວງຍາກຂອງທົວລະບົບທະນາຄານ",
    url: "../backend/reportprint/Provision_Requirement_Report_For_All_Banks",
  },
  {
    message: "ຈຳນວນເງິນແຮເພື່ອການສູນເສຍເງິນກູ້ຂອງແຕ່ລະທະນາຄານ",
    url: "../backend/reportprint/General_Provisions_by_Bank",
  },
  {
    message: "ຈຳນວນເງິນແຮເພື່ອການສູນເສຍເງິນກູ້ຂອງທົວລະບົບທະນາຄານ",
    url: "../backend/reportprint/General_Provisions_For_All_Banks",
  },
];
</script>
<template>
  <div v-for="(item, index) in items" :key="index">
    <v-hover>
      <template v-slot:default="{ isHovering, props }">
        <v-card
          v-bind="props"
          :color="isHovering ? 'indigo-lighten-2' : undefined"
        >
          <nuxt-link :to="item.url" style="text-decoration: none">
            <div
              style="width: 100%; height: 40px; text-decoration: none"
              class="mt-4 bg-"
            >
              <p class="ml-2">{{ item.message }}</p>
            </div></nuxt-link
          >
        </v-card>
      </template>
    </v-hover>
  </div>
</template>
