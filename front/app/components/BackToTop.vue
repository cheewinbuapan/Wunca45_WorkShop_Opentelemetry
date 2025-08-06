<script setup lang="ts">
const showBtn = ref<boolean>(false);

onMounted(() => {
  window.addEventListener("scroll", scrollListener);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", scrollListener);
});

const backToTop = () => {
  window.scrollTo({
    behavior: "smooth",
    top: 0,
  });
};
const scrollListener = () => {
  showBtn.value = window.scrollY > 150;
};
</script>

<template>
  <div
    :class="[
      'bg-primary fixed right-3 bottom-14 z-[9999] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300 ease-in-out',
      showBtn
        ? 'pointer-events-auto opacity-10 hover:opacity-80'
        : 'pointer-events-none opacity-0',
    ]"
    @click="backToTop"
  >
    <UIcon name="i-fa6-solid-arrow-up" class="text-base text-white" />
  </div>
</template>
