<template>
  <UModal
    v-model:open="isOpen"
    :close="{
      size: 'xs',
      class: 'rounded-full',
    }"
    :dismissible="false"
    :ui="{ content: 'w-full sm:max-w-6xl' }"
    :title
  >
    <template #body>
      <UForm :state @submit="onSave">
        <div class="flex flex-col gap-5">
          <CustomCkEditor v-model="state.content" />
          <UButton
            type="submit"
            size="xl"
            block
            :label="$t('SAVE')"
            class="justify-center"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface WYSIWYG {
  content: string;
}
const isOpen = ref<boolean>(false);
const title = ref<string>("WYSIWYG Editor");
const payload = ref<any | undefined>();
const saving = ref<boolean>(false);

const emits = defineEmits<{
  (event: "save", value: string, payload?: any): void;
}>();

defineShortcuts({
  escape: {
    usingInput: true,
    handler: () => {
      isOpen.value = false;
    },
  },
});

const clearData = () => {
  state.value = {
    content: "",
  };
};

const state = ref<WYSIWYG>({
  content: "",
});

const onSave = async () => {
  saving.value = true;
  isOpen.value = false;
  emits("save", state.value.content, payload.value);
};

const show = async (data: string, attr?: any, header?: string) => {
  saving.value = false;
  payload.value = attr;
  clearData();
  state.value.content = data;
  if (header) {
    title.value = header;
  }
  isOpen.value = true;
};

defineExpose({
  show,
});
</script>
