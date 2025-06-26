<script setup lang="ts">
import { useRoute } from '#app';
import UpdateUserTest from '~/components/UserTest/UpdateUserTest.vue';
import {useUserManageStore} from "~/stores/usermanage";
const useStore = useUserManageStore();
const route = useRoute();
const id = Number(Array.isArray(route.query.id) ? route.query.id[0] : route.query.id);
onMounted(()=>{
useStore.getDetailUser(id);
})

</script>
<template>
    <UpdateUserTest/>
</template>