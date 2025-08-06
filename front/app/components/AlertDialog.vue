<script setup lang="ts">
const { t } = useI18n();

type DialogTypes = "notice" | "confirm" | "delete";

const props = withDefaults(
  defineProps<{
    type: DialogTypes;
    closeBtnColor?:
      | "primary"
      | "secondary"
      | "success"
      | "info"
      | "warning"
      | "error"
      | "neutral";
    closeBtnText?: string;
    confirmBtnColor?:
      | "primary"
      | "secondary"
      | "success"
      | "info"
      | "warning"
      | "error"
      | "neutral";
    confirmBtnText?: string;
    disableConfirm?: boolean;
    isCloseBtn?: boolean;
    size?: Size;
  }>(),
  {
    isCloseBtn: true,
    disableConfirm: false,
  }
);

const titleText = ref<string>("");
const headerText = ref<string>(t("DELETE_DATA"));
const detailText = ref<string>(t("CONFIRM_DELETE"));

const isNotice = computed<boolean>(() => {
  return props.type === "notice";
});

const isDelete = computed<boolean>(() => {
  return props.type === "delete";
});

const renderCloseBtnText = computed<string>(() => {
  return props.closeBtnText
    ? props.closeBtnText
    : isNotice.value
    ? t("OK")
    : t("CANCEL");
});
const renderConfirmBtnText = computed<string>(() => {
  return props.confirmBtnText
    ? props.confirmBtnText
    : isDelete.value
    ? t("DELETE")
    : t("CONFIRM");
});

const renderSize = computed<string>(() => {
  return props.size
    ? `sm:max-w-${props.size}`
    : isNotice.value
    ? "sm:max-w-md"
    : isDelete.value
    ? "sm:max-w-sm"
    : "";
});

const isOpen = ref<boolean>(false);
const payload = ref<any | undefined>();

defineShortcuts({
  escape: {
    usingInput: true,
    handler: () => {
      isOpen.value = false;
    },
  },
});

const emit = defineEmits<{
  (e: "confirm" | "close", payload: any): void;
}>();

const onConfirm = (): void => {
  emit("confirm", payload.value);
  isOpen.value = false;
};
const onClose = (): void => {
  emit("close", payload.value);
  isOpen.value = false;
};

const show = (
  title?: string,
  data?: any,
  header?: string,
  detail?: string
): void => {
  payload.value = data;
  if (title) titleText.value = title;
  if (header) headerText.value = header;
  if (detail) detailText.value = detail;
  isOpen.value = true;
};

const close = (): void => {
  isOpen.value = false;
};

defineExpose({
  show,
  close,
});
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :dismissible="false"
    :ui="{ content: `w-full ${renderSize}` }"
  >
    <template #content>
      <div class="flex flex-col items-center gap-5 p-5">
        <slot :payload="payload" :title="headerText" :detail="detailText">
          <UIcon
            name="i-fa6-solid-trash"
            class="text-5xl text-error-600 mt-5"
          />
          <div
            v-if="isDelete"
            class="flex items-center justify-center text-center gap-5"
          >
            <div class="flex flex-col gap-3">
              <h1 v-if="headerText" class="text-xl font-bold text-error-600">
                {{ headerText }}
              </h1>
              <p v-if="detailText" class="text-sm text-error-600">
                {{ detailText }}
                {{ titleText }}
              </p>
            </div>
          </div>
        </slot>
        <div class="flex justify-evenly items-center w-full">
          <UButton
            v-if="isCloseBtn"
            size="xl"
            :color="closeBtnColor || (isNotice ? 'info' : 'neutral')"
            variant="soft"
            class="min-w-20 justify-center text-center"
            :label="renderCloseBtnText"
            @click="onClose"
          />

          <UButton
            v-if="!isNotice"
            size="xl"
            :disabled="disableConfirm"
            :color="confirmBtnColor || (isDelete ? 'error' : 'primary')"
            class="min-w-20 justify-center text-center"
            :label="renderConfirmBtnText"
            @click="onConfirm"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
