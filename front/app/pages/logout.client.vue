<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const auth = authen();
const router = useRouter();

definePageMeta({
  layout: "blank",
  middleware: "auth",
});
useHead({
  title: t("LOGOUT"),
});

await auth.logout();
router.push(localePath({ name: "index" }));
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center gap-y-5 bg-neutral-100 px-10 sm:px-20 lg:px-40 xl:px-60 2xl:px-80"
  >
    <h1 class="text-primary text-center text-3xl">Logged out</h1>
    <UProgress animation="carousel" />
  </div>
</template>
