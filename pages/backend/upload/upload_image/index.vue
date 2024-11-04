<script setup lang="ts">

    definePageMeta({
      layout: "backend",
      middleware:["auth"]
    });

    useHead({
      title: "image uplod",
      
      meta: [
        {
          name: "keywords",
          content: "Report, Nuxt 3, Backend",
        },
        {
          name: "Description",
          content: "Report Nuxt 3, IT Genius Engineering",
        },
      ],
    });
</script>

<template>
<UploadFileUploadImage/>
</template>