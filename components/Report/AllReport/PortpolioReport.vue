<script setup lang="ts">
const items = [
  { message: "ການຈັດຊັ້ນໜີ້ຕາມເປົ້າໝາຍເງິນກູ້ຂອງບັນດາທະນາຄານ", url: "#" },
  { message: "ການຈັດຊັ້ນໜີ້ຕາມເປົ້າໝາຍເງິນກູ້ຂອງທົ່ວລະບົບທະນາຄານ", url: "#" },
  { message: "ການຈັດຊັ້ນໜີ້ຕາມແຕ່ລະແຂວງຂອງບັນດາທະນາຄານ", url: "#" },
  { message: "ການຈັດຊັ້ນໜີ້ຕາມແຕ່ລະແຂວງຂອງທົວລະບົບທະນາຄານ", url: "#" },
  { message: "ການວິເຄາະລວມຂອງຈຳນວເງິນກູ້ຕາມການຈັດຊັ້ນໜີ້", url: "#" },
  {
    message: "ການວິເຄາະລວມຂອງຈຳນວນລວມເງິນຄ່າເງິນກູ້ຕາມການຈັດຊັ້ນໜີ້",
    url: "#",
  },
  {
    message: "ບົດລາຍງານແຮຄ່າເສື່ອມມູນຄ່າໜີ້ຕອ້ງຮັບທວງຍາກຂອງແຕ່ລະທະນາຄານ",
    url: "#",
  },
  {
    message: "ບົດລາຍງານເງິນແຮຄ່າເສື່ອມມູນຄ່າໜີ້ຕອ້ງຮັບທວງຍາກຂອງທົວລະບົບທະນາຄານ",
    url: "#",
  },
  { message: "ຈຳນວນເງິນແຮເພື່ອການສູນເສຍເງິນກູ້ຂອງແຕ່ລະທະນາຄານ", url: "#" },
  { message: "ຈຳນວນເງິນແຮເພື່ອການສູນເສຍເງິນກູ້ຂອງທົວລະບົບທະນາຄານ", url: "#" },
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
