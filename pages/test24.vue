<template>
  <div class="user-form-container">
    <div class="user-form-card">
      <h2 class="form-title">Create User</h2>

      <form @submit.prevent="submitForm" class="user-form-grid">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="Username"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirm_password">Confirm Password</label>
          <input
            id="confirm_password"
            v-model="form.confirm_password"
            type="password"
            placeholder="Confirm Password"
            required
          />
        </div>

        <div class="form-group">
          <label for="nameL">Name (Local)</label>
          <input
            id="nameL"
            v-model="form.nameL"
            type="text"
            placeholder="Name (L)"
          />
        </div>

        <div class="form-group">
          <label for="surnameL">Surname (Local)</label>
          <input
            id="surnameL"
            v-model="form.surnameL"
            type="text"
            placeholder="Surname (L)"
          />
        </div>

        <div class="form-group">
          <label for="nameE">Name (English)</label>
          <input
            id="nameE"
            v-model="form.nameE"
            type="text"
            placeholder="Name (E)"
          />
        </div>

        <div class="form-group">
          <label for="surnameE">Surname (English)</label>
          <input
            id="surnameE"
            v-model="form.surnameE"
            type="text"
            placeholder="Surname (E)"
          />
        </div>

        <div class="form-group">
          <label for="MID">Member</label>
          <select id="MID" v-model="form.MID" required>
            <option value="">Select a member</option>
            <option v-for="m in members" :key="m.id" :value="m.id">
              {{ m.bnk_code }} - {{ m.code }} - {{ m.nameL }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="GID">Role</label>
          <select id="GID" v-model="form.GID" required>
            <option value="">Select a role</option>
            <option v-for="r in roles" :key="r.id" :value="r.id">
              {{ r.id }} - {{ r.name }}
            </option>
          </select>
        </div>

        <div class="form-group full-width">
          <label for="profile_image">Profile Image (Optional)</label>
          <input
            id="profile_image"
            type="file"
            @change="handleFileUpload"
            accept="image/*"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating...' : 'Create User' }}
          </button>
        </div>
      </form>

      <Transition name="fade">
        <div v-if="successMessage" class="success-box">
          {{ successMessage }}
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="errorMessage" class="error-box">
          {{ errorMessage }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useUserApi } from "~/composables/useUserApi";

definePageMeta({
  middleware: "auth",
  layout: "backend",
});

const { createUser } = useUserApi();

const form = ref({
  username: "",
  password: "",
  confirm_password: "",
  nameL: "",
  surnameL: "",
  nameE: "",
  surnameE: "",
  MID: "",
  GID: "",
  branch_id: "",
  profile_image: null as File | null,
});

const members = ref([]);
const roles = ref([]);
const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const passwordsMatch = computed(() => form.value.password === form.value.confirm_password);

const resetForm = () => {
  form.value = {
    username: "",
    password: "",
    confirm_password: "",
    nameL: "",
    surnameL: "",
    nameE: "",
    surnameE: "",
    MID: "",
    GID: "",
    branch_id: "",
    profile_image: null,
  };
  successMessage.value = "";
  errorMessage.value = "";
  isSubmitting.value = false;
};

const handleFileUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    // Optional: Add file size validation (e.g., < 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = "Image file too large (max 5MB)";
      (e.target as HTMLInputElement).value = "";
      return;
    }
    form.value.profile_image = file;
  }
};

const submitForm = async () => {
  if (!passwordsMatch.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }

  if (!form.value.username || !form.value.password || !form.value.MID || !form.value.GID) {
    errorMessage.value = "Please fill in all required fields";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    // Prepare FormData for file upload compatibility
    const submitData = new FormData();
    Object.entries(form.value).forEach(([key, value]) => {
      if (value !== "" && value !== null) {
        submitData.append(key, value as string | Blob);
      }
    });

    const res = await createUser(submitData);
    successMessage.value = "User created successfully!";
    resetForm();
    console.log("✅ Success:", res);
  } catch (err: any) {
    errorMessage.value = err.message || "Error creating user. Please try again.";
    console.error("❌ Error creating user:", err);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    const config = useRuntimeConfig();
    const apiUrl = config.public.strapi.url;
    const token = useCookie("access_token").value;

    if (!token) {
      errorMessage.value = "Authentication required. Please log in.";
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const [membersRes, rolesRes] = await Promise.all([
      $fetch(`${apiUrl}api/memberinfo/`, { headers }),
      $fetch(`${apiUrl}api/roles/`, { headers }),
    ]);

    members.value = membersRes || [];
    roles.value = rolesRes || [];
  } catch (err) {
    errorMessage.value = "Failed to load data. Please refresh the page.";
    console.error("Error loading data:", err);
  }
});
</script>

<style scoped>
.user-form-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.user-form-card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  transition: all 0.2s ease;
}

.user-form-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #0f172a;
  text-align: center;
}

.user-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.375rem;
  color: #334155;
  font-size: 0.875rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #ffffff;
  transition: all 0.2s ease;
  color: #1e293b;
}

.form-group input::placeholder {
  color: #94a3b8;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group select {
  cursor: pointer;
}

.full-width {
  grid-column: 1 / -1;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f5f9;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
  min-width: 120px;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
}

.success-box,
.error-box {
  margin-top: 1.25rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.success-box {
  background: #ecfdf5;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.error-box {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>