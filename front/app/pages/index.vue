<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

useRouter().replace(useLocalePath()({ name: "products" }));
</script>
