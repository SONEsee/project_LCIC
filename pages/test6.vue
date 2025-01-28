<template>
  <v-container>
    <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
      <!-- Input Fields -->



    <v-container fluid>
      <v-row class="d-flex flex-wrap">
        <!-- First Row -->
        <v-col cols="12" md="6">
          <v-text-field v-model="form.code" label="ໂຕຫຍໍ້" required></v-text-field>
          <v-text-field v-model="form.bnk_code" label="ລະຫັດທະນາຄານ" required></v-text-field>  
          <v-text-field v-model="form.slug" label="ຊື່ເຕັມ" required></v-text-field>
          <v-text-field v-model="form.nameL" label="ຊື່ພາສາລາວ"></v-text-field>
          <v-text-field v-model="form.nameE" label="ຊື່ພາສາອັງກິດ"></v-text-field>
          <v-select v-model="form.bnk_type" :items="bnkTypes" label="ປະເພດ" required></v-select>
          <v-select v-model="form.memberType" :items="memberTypes" label="ໝວດໝູ່" required></v-select>
        </v-col>

        <!-- Second Row -->
        <v-col cols="12" md="6">
          <v-text-field v-model="form.descL" label="ລາຍລະອຽດ ພາສາລາວ" multiline></v-text-field>
          <v-text-field v-model="form.descE" label="ລາຍລະອຽດ ພາສາອັງກິດ" multiline></v-text-field>
          <v-text-field v-model="form.streetInfoL" label="ສະຖານທີ່ ພາສາລາວ"></v-text-field>
          <v-text-field v-model="form.streetInfoE" label="ສະຖານທີ່ ພາສາອັງກິດ"></v-text-field>
          <v-text-field v-model="form.villageInfo" label="ບ້ານ" type="number" required></v-text-field>
          <v-text-field v-model="form.districtInfo" label="ເມືອງ" type="number" required></v-text-field>
          <v-text-field v-model="form.provInfo" label="ເເຂວງ" type="number" required></v-text-field>
         
        </v-col>
      </v-row>
    </v-container>

      <v-checkbox
        v-model="form.published"
        label="ສະເເດງລາຍການ"
      ></v-checkbox>

    <v-date-input
      v-model="form.dateRegis"
      label="ວັນທີ່ ລົງທະບຽນ"
      max-width="368"
    ></v-date-input>
      <!-- Submit Button -->
      <v-btn color="primary" @click="submitForm">Submit</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { VDateInput } from 'vuetify/labs/VDateInput'
definePageMeta({
  middleware: "auth",
  layout: "backend",
});
export default {
  data() {
    return {
      valid: true,
      menu: false,
      form: {
        code: '',
        bnk_code: '',
        bnk_type: null,
        slug: '',
        nameL: '',
        nameE: '',
        descL: '',
        descE: '',
        streetInfoL: '',
        streetInfoE: '',
        villageInfo: null,
        districtInfo: null,
        provInfo: null,
        memberType: null,
        published: false,
        dateRegis: null,
      },
      bnkTypes: [1, 2],
      memberTypes: [1, 2, 3, 4, 5, 6, 7],
    };
  },
  components: {
    VDateInput,
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async submitForm() {
      if (!this.$refs.form.validate()) {
        alert('Please fill all required fields.');
        return;
      }

      try {
        const { data, error } = await useFetch('http://192.168.45.56:8000/api/add-member/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.form),
        });

        if (error) {
          console.error(error);
          alert('Error submitting form. Please check your input.');
        } else {
          alert('Member added successfully!');
          this.resetForm();
        }
      } catch (err) {
        console.error('Error:', err);
        alert('An error occurred while submitting the form.');
      }
    },
    resetForm() {
      this.form = {
        code: '',
        bnk_code: '',
        bnk_type: null,
        slug: '',
        nameL: '',
        nameE: '',
        descL: '',
        descE: '',
        streetInfoL: '',
        streetInfoE: '',
        villageInfo: null,
        districtInfo: null,
        provInfo: null,
        memberType: null,
        published: false,
        dateRegis: null,
      };
    },
  },
  watch: {
    'form.dateRegis'(newDate) {
      if (newDate) {
        this.form.dateRegis = this.formatDate(newDate);
      }
    },
  },
};
</script>

<style scoped>
/* Add custom styles as needed */
</style>
