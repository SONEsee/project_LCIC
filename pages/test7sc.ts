import { ref, onMounted } from "vue";
import axios from "axios";

export const useUserProfile = () => {
  const userProfiles = ref([]);

  onMounted(async () => {
    try {
      const response = await axios.get(
        "http://192.168.45.56:8000/api/api/get_login3/"
      );
      userProfiles.value = response.data;
      console.log("User profiles:", userProfiles.value)
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  });

  return {
    userProfiles,
  };
};
