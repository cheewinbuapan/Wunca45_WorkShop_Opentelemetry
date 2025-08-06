<template>
  <UPopover
    :mode
    :content="{ side: 'top' }"
    :ui="{ content: 'bg-neutral-50/40 backdrop-blur-xl' }"
  >
    <UIcon
      name="i-fa6-regular-circle-question"
      class="text-info-400 cursor-help text-sm"
    />
    <template #content>
      <div class="flex max-w-80 flex-col gap-1 px-3 py-2">
        <slot>
          <slot name="title">
            <p v-if="title" class="text-sm font-bold">
              {{ title }}
            </p>
          </slot>
          <slot name="detail">
            <p v-if="detail" class="text-xs">
              {{ detail }}
            </p>
          </slot>
          <slot name="after" />
        </slot>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    detail?: string;
    mode?: "hover" | "click";
  }>(),
  {
    mode: "hover",
  },
);
</script>
