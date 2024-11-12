
<template>
    <v-row>
      <v-col cols="12" md="8" lg="8"> <!-- Responsive sizes for different screens -->
        <v-text-field
          v-model="search"
          label="ຄົ້ນຫາຜູ້ນໍາໃຊ້"
          prepend-inner-icon=""
          clearable
          @input="onSearch"
          class="custom-search-box"
        ></v-text-field>
      </v-col>
    </v-row>
  </template>
  
  <script>
  export default {
    data() {
      return {
        search: '',
      };
    },
    methods: {
      onSearch() {
        this.$emit('searchQuery', this.search); // Emit search query to the parent component
      },
    },
  };
  </script>
  <style>
    .custom-search-box {
  height: 40px; /* Set your custom size here */
}
</style>