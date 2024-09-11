<template>
  <div :items="datedetail || combinedData" class="ml-5" style="color: black">
    <template v-if="datedetail.length > 0">
      <p>
        ປະຈຳເດືອນ:
        <b
          >{{ datedetail[0].period[1] }}{{ datedetail[0].period[2] }} /
          {{ datedetail[0].period[3] }}{{ datedetail[0].period[4]
          }}{{ datedetail[0].period[5] }}{{ datedetail[0].period[6] }}</b
        >
      </p>
      <p>
        ຂອງທະນາຄານ: <b>{{ combinedData[3].bnk_code }}</b
        >, ສາຂາ: <b>{{ combinedData[3].branch_id_code }}</b>
      </p>
      <p>
        ລາຍການຂໍ້ມູນທີ່ອັບໂຫຼດທັງໝົດ:
        <b> {{ combinedData.length -1}}</b> ລາຍການ
      </p>
    </template>
  </div>
  <!-- <div :items="combinedData" class="ml-5" style="color: black">
    <template v-if="combinedData.length > 0">
      {{ combinedData.length }}
    </template>
  </div> -->

  <!-- <p>{{ combinedData }}</p> -->
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, computed, PropType } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "~~/.nuxt/components";

export default defineComponent({
  props: {
    cidData: {
      type: Object as PropType<any>,
      required: true,
    },
  },
  setup() {
    definePageMeta({
      layout: "backend",
    });

    useHead({
      title: "Upload File",
      meta: [
        { name: "keywords", content: "Report, Nuxt 3, Backend" },
        {
          name: "Description",
          content: "Report Nuxt 3, IT Genius Engineering",
        },
      ],
    });

    const detail = ref<any[]>([]);
    const date = ref<any[]>([]);
    const c1 = ref<any[]>([])
    const dispute = ref<any[]>([])

    const route = useRoute();

    onMounted(() => {
      const queryData = route.query.data as string;
      if (queryData) {
        const parsedData = JSON.parse(queryData);
        detail.value = parsedData.C_error || [];
        date.value = parsedData.uploadfile || [];
        c1.value = parsedData.C1 || []
        dispute.value = parsedData.C1_disptes || []
      }
    });

    const combinedData = computed(() => {
      return [...(date.value || []), ...(detail.value || []), ...(c1.value || []), ...(dispute.value || [])].map((item) => {
        return {
          branch_id_code: item?.branch_id_code || null,

          bnk_code: item?.bnk_code || null,
          period: item?.period || null,
        };
      });
    });
    const datedetail = computed(() => {
      const filteredCerror = date.value || [];

      return [...filteredCerror].map((item) => {
        return {
          period: item?.period || null,
        };
      });
    });

    return {
      combinedData,
      datedetail,
    };
  },
});
</script>
