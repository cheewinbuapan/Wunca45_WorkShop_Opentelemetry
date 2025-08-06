<template>
  <UTooltip :text="tooltopText">
    <UButton
      size="xs"
      variant="link"
      color="neutral"
      class="cursor-copy"
      icon="i-fa6-solid-copy"
      :ui="{
        base: 'p-0',
        leadingIcon: 'size-3',
      }"
      @click="onCopyText"
    >
      {{ label }}
    </UButton>
  </UTooltip>
</template>

<script setup lang="ts">
import useClipboard from "vue-clipboard3";

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    text: string;
    label?: string;
  }>(),
  {
    label: "",
  },
);

const tooltopText = ref<string>(t("COPY"));

let timeout: ReturnType<typeof setTimeout> | undefined = undefined;

const onCopyText = async () => {
  if (timeout) {
    clearTimeout(timeout);
  }
  await useClipboard().toClipboard(props.text);
  tooltopText.value = t("COPIED");
  useIToast().onInfo(t("COPIED"), t("COPIED_", { text: props.text }));
  timeout = setTimeout(() => {
    tooltopText.value = t("COPY");
  }, 1000);
};
</script>
