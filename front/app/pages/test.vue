<template>
  <div>
    <UButton label="Sentry Test" @click="test" />
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "blank",
});

const test = () => {
  throw new Error("Sentry Test Error");
};
</script>
