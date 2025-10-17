import { ref, computed, onMounted } from 'vue';

export const useUserData = () => {
  const user = ref<any>(null);
  const isLoading = ref(false);

 
  const loadUserData = () => {
    try {
      isLoading.value = true;
      const userString = localStorage.getItem('user_data');
      if (userString) {
        user.value = JSON.parse(userString);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  };

 
  const saveUserData = (userData: any) => {
    try {
      localStorage.setItem('user_data', JSON.stringify(userData));
      user.value = userData;
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };


  const clearUserData = () => {
    localStorage.removeItem('user_data');
    user.value = null;
  };


  const userId = computed(() => user.value?.MID?.id || '');
  const userid = computed(()=>user.value?.UID || '');
  const userName = computed(() => user.value?.MID?.name || '');
  const userBankCode = computed(() => user.value?.MID?.bnk_code || '');
  const isAdmin = computed(() => user.value?.MID?.id === '01');
  const isLoggedIn = computed(() => !!user.value);

 
  onMounted(() => {
    if (!user.value) {
      loadUserData();
    }
  });

  return {
   
    user,
    isLoading,
    
    
    userId,
    userid,
    userName,
    userBankCode,
    isAdmin,
    isLoggedIn,
    
    
    loadUserData,
    saveUserData,
    clearUserData,
  };
};