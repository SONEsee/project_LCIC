<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5" width="400">
      <v-card-title class="text-h5 text-center">Welcome back!</v-card-title>
      <v-card-subtitle class="text-center">We're so excited to see you again!</v-card-subtitle>
      <v-form @submit.prevent="login">
        <v-text-field
          v-model="email"
          label="EMAIL OR PHONE NUMBER"
          prepend-icon="mdi-email"
          :rules="[rules.required, rules.email]"
          required
        />
        <v-text-field
          v-model="password"
          label="PASSWORD"
          type="password"
          prepend-icon="mdi-lock"
          :rules="[rules.required]"
          required
        />
        <v-btn type="submit" color="primary" block class="mb-4">Log In</v-btn>
        <v-btn text class="d-block text-center mb-4">Forgot your password?</v-btn>
      </v-form>
      <div class="text-center mb-2">Log in with QR Code</div>
      <v-img src="qr-code-image-url" contain height="100" class="mb-4"></v-img>
      <div class="text-center">Need an account? <a href="#">Register</a></div>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  methods: {
    login() {
      // Handle login logic here
      console.log('Email:', this.email)
      console.log('Password:', this.password)
    }
  }
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
