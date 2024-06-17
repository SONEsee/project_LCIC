<!-- <template>
  <div>
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <v-table>
            <thead>
              <tr>
                <th><p>ລ/ດ</p></th>
                <th><p>ຊື່ (ພາສາລາວ)</p></th>
                <th><p>ຊື່ (ອັງກິດ)</p></th>
                <th><p>ລະຫັດວິສາຫະກິດ</p></th>
                <th><p>ທີ່ຢູ່</p></th>
                <th><p>ໂຕເລກຜູ້ເສຍອາກອນ</p></th>
                <th><p>ວັນທີເຂົ້າ</p></th>
                <th><p>ວັນທີ່ອອກ</p></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>{{fetchDta}}</p>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script lang="ts">
definePageMeta({
  layout: "backend",
});

useHead({
  title: "Search",
  meta: [
    {
      name: "keywords",
      content: "Report, Nuxt 3, Backend",
    },
    {
      name: "Description",
      content: "Report Nuxt 3,  IT Genius Engineering",
    },
  ],
});

export default defineComponent({

    setup() {
        const fetchDta = async () =>{
            try {
                const response = await fetch("http://127.0.0.1:35729/api/api2/enterpriseinfo/");
                const data = await response.json();
                console.log(data);
            }
        }
        return fetchDta();
    },
    
});
</script> -->


<template>
    <!-- <div>
        {{ enterprises }}
    </div> -->
    <div>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <v-table>
              <thead>
                <tr>
                  <th><p>ລ/ດ</p></th>
                  <th><p>ຊື່ (ພາສາລາວ)</p></th>
                  <th><p>ຊື່ (ອັງກິດ)</p></th>
                  <th><p>ລະຫັດວິສາຫະກິດ</p></th>
                  <th><p>ທີ່ຢູ່</p></th>
                  <th><p>ໂຕເລກຜູ້ເສຍອາກອນ</p></th>
                  <th><p>ວັນທີເຂົ້າ</p></th>
                  <th><p>ວັນທີ່ອອກ</p></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(enterprise, index) in enterprises" :key="enterprise.LCICID">
                  <td>{{ index + 1 }}</td>
                  <td>{{ enterprise.enterpriseNameLao }}</td>
                  <td>{{ enterprise.enterpriseNameEnglish }}</td>
                  <td>{{ enterprise.EnterpriseID }}</td>
                  <td>{{ enterprise.enLocation }}</td>
                  <td>{{ enterprise.regisCertificateNumber }}</td>
                  <td>{{ formatDate(enterprise.regisDate) }}</td>
                  <td>{{ formatDate(enterprise.CancellationDate) }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-col>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  
  export default defineComponent({
    setup() {
      const enterprises = ref<any[]>([]);
  
      const fetchDta = async () => {
        try {
          const response = await fetch("http://127.0.0.1:35729/api/api2/enterpriseinfo/");
          const data = await response.json();
          enterprises.value = data;
        } catch (error) {
          console.error(error);
        }
      };
  
      const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString();
      };
  
      onMounted(fetchDta);
   console.log(enterprises);
      return {
        enterprises,
        formatDate
      };
    }
   
    
  });
  </script>
  