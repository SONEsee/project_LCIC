<template>
  <div>
    <h1>Create B1 Record</h1>
    <form @submit.prevent="createB1">
      <!-- Add your form fields here -->
      <div>
        <label for="lcicID">LCIC ID:</label>
        <input type="text" v-model="form.lcicID" />
      </div>
      <div>
        <label for="customer_id">Customer ID:</label>
        <input type="text" v-model="form.customer_id" />
      </div>
      <div>
        <label for="Boolean">Boolean:</label>
        <input type="checkbox" v-model="form.Boolean" />
      </div>
      <button type="submit">Submit</button>
    </form>
    <div v-if="response">
      <p>Response: {{ response }}</p>
    </div>
  </div>
</template>

<script lang="ts">


export default defineComponent({
  data() {
    return {
      form: {
        lcicID: '',
        customer_id: '',
        Boolean: false,
      },
      response: null,
    }
  },
  methods: {
    async createB1() {
      try {
        const response = await this.$axios.post('http://127.0.0.1:35729/api/create_b1/', this.form)
        this.response = response.data
      } catch (error) {
        console.error(error)
      }
    },
  },
})
</script>

<style scoped>
/* Add your styles here */
</style>
