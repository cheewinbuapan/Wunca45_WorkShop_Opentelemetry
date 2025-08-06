<template>
  <div class="flex gap-5 min-w-32">
    <div
      v-for="(option, index) in options"
      :key="`option-${index}`"
      :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
    >
      <div
        :class="{ 'pointer-events-none': disabled }"
        @click="model = typeof option === 'string' ? option : option.value"
      >
        <div class="pointer-events-none">
          <UCheckbox
            :model-value="
              (typeof option === 'string' && model === option) ||
              (typeof option !== 'string' && model === option.value)
            "
            :label="typeof option === 'string' ? option : (option.label as string)"
            class="min-w-20"
            color="success"
            disabled
            :ui="{
              base: disabled ? 'opacity-50' : 'opacity-100',
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string | number>();

withDefaults(
  defineProps<{
    options: string[] | DefaultSelectOptions[];
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const emits = defineEmits<{
  (e: "change", value: string | number): void;
}>();

watch(model, () => {
  emits("change", model.value!);
});
</script>
