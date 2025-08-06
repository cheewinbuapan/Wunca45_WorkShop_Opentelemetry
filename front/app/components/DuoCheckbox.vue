<template>
  <div
    :class="['flex gap-5 min-w-32', { 'flex-row-reverse justify-end': swap }]"
  >
    <div :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'">
      <div :class="{ 'pointer-events-none': disabled }" @click="model = true">
        <div class="pointer-events-none">
          <UCheckbox
            :model-value="model === true"
            :label="renderTrueLabel"
            class="min-w-20"
            disabled
            :ui="{
              base: disabled ? 'opacity-50' : 'opacity-100',
            }"
          />
        </div>
      </div>
    </div>
    <div :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'">
      <div :class="{ 'pointer-events-none': disabled }" @click="model = false">
        <div class="pointer-events-none">
          <UCheckbox
            :model-value="model === false"
            :label="renderFalseLabel"
            class="min-w-20"
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
const model = defineModel<boolean>();
const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    trueLabel?: string;
    falseLabel?: string;
    swap?: boolean;
    disabled?: boolean;
  }>(),
  {
    swap: false,
    disabled: false,
  }
);

const emits = defineEmits<{
  (e: "change", value: boolean): void;
}>();

const renderTrueLabel = computed(() => {
  return props.trueLabel ? props.trueLabel : t("YES");
});
const renderFalseLabel = computed(() => {
  return props.falseLabel ? props.falseLabel : t("NO");
});

watch(model, () => {
  emits("change", model.value!);
});
</script>
