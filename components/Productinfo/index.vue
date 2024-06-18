<template>
  <div>
    <div v-for="product in products" :key="product.code">
      <!-- <h2>{{ product.nameL }} / {{ product.nameE }}</h2>
        <p>{{ product.descL }} / {{ product.descE }}</p>
        <p>Price: {{ product.price }}</p>
        <img v-if="product.pimage" :src="product.pimage" alt="Product Image" /> -->

      <v-table>
        <thead>
          <tr>
            <th>ບົດລາຍງານ</th>
            <th>ລາຍລະອຽດຂອງບົດລາຍງານ</th>
            <th>ຄ່າທຳນຽມ</th>
          </tr>
        </thead>
        <tbody style="font-size:90%;">
          <tr v-for="product in products" :key="product.code">
            <td>{{ product.nameL }}</td>
            <td style="font-size:85%;">{{ product.descL }}</td>
            <td class="text-red" style="font-size:90%;">{{ product.price }} <b class="text-black">ກີບ</b></td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  setup() {
    const products = ref<any[]>([]);

    const fetchProducts = async (code: string) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:35729/api/productinfo2/?code=${code}`
        );
        const data = await response.json();
        products.value = data;
      } catch (error) {
        console.error("Error fetching product info:", error);
      }
    };

    onMounted(() => {
      fetchProducts("p002");
    });

    return {
      products,
    };
  },
});
</script>
