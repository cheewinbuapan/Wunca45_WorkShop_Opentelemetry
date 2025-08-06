<template>
  <LayoutsTopbar />
  <LayoutsSidebar v-if="showSidebar" class="lg:hidden" />
  <div class="min-h-full">
    <div
      v-if="showSidebar"
      :class="[
        'z-20 flex h-screen w-72 shrink-0 flex-col shadow-sm transition-all duration-500 ease-in-out max-lg:hidden lg:fixed lg:inset-y-0',
      ]"
    >
      <LayoutsSidebarItems />
    </div>
    <div
      :class="[
        'flex flex-col transition-all duration-500 ease-in-out',
        showSidebar ? 'lg:pl-72' : 'lg:pl-0',
      ]"
    >
      <UContainer class="flex w-full flex-col items-center gap-5 p-5 lg:p-10">
        <slot />
      </UContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = authen();

const showSidebar = computed(
  () => auth.isAdmin() && useRoute().name?.toString().includes("admin"),
);
</script>
