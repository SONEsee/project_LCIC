<template>
    <div class="candidate-card">
      <img :src="image" alt="Candidate Image" class="candidate-image"/>
      <h2>{{ name }}</h2>
      <p>{{ votes }} votes</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    props: {
      name: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      votes: {
        type: Number,
        required: true
      }
    }
  });
  </script>
  
  <style scoped>
  .candidate-card {
    border: 1px solid #ccc;
    padding: 16px;
    text-align: center;
  }
  .candidate-image {
    max-width: 100px;
    border-radius: 50%;
  }
  </style>
  