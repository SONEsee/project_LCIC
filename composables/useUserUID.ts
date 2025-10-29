import { ref, computed } from 'vue'

interface UserData {
  UID: number
  MID: {
    id: string
    code: string
  }
  GID: {
    GID: number
    nameL: string
  }
  username: string
  nameL: string
  nameE: string
  surnameL: string
  surnameE: string
  profile_image: string | null
  is_active: boolean
  last_login: string
  is_staff: boolean
  is_superuser: boolean
}

export function useUserUID() {
  const userData = ref<UserData | null>(null)

  // อ่านจาก localStorage
  const loadUserData = () => {
    try {
      const str = localStorage.getItem('user_data')
      if (str) {
        userData.value = JSON.parse(str)
      }
    } catch (err) {
      console.error('Error parsing user_data from localStorage', err)
    }
  }

  // UID ของผู้ล็อกอินปัจจุบัน
  const UID = computed(() => userData.value?.UID ?? null)

  loadUserData()

  return { userData, UID }
}
