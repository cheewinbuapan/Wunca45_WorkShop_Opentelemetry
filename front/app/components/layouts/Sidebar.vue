<script setup lang="ts">
const side = sidebar();

const drawer = computed({
  get() {
    return side.drawer;
  },
  set(val) {
    side.drawer = val;
  },
});

defineShortcuts({
  escape: {
    usingInput: true,
    handler: () => {
      side.drawer = false;
    },
  },
});
</script>

<template>
  <USlideover
    v-model:open="drawer"
    side="left"
    class="lg:hidden"
    :ui="{ content: 'max-w-xs' }"
  >
    <template #content>
      <LayoutsSidebarItems />
    </template>
  </USlideover>
</template>
