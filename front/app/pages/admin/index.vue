<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "admin"],
});

const localePath = useLocalePath();

useRouter().push(localePath({ name: "admin-orders" }));
</script>
