<template>
  <UModal
    v-model:open="isOpen"
    :close="{
      size: 'xs',
      class: 'rounded-full',
    }"
    :dismissible="false"
    :title="
      mode == 'add'
        ? t('ADD_', { text: modelName })
        : t('EDIT_', { text: modelName })
    "
  >
    <template #body>
      <UForm :schema :state @submit="onSave">
        <div class="flex flex-col gap-5">
          <UFormField
            :label="`${t('NAME_', { text: modelName })}`"
            name="name"
            required
          >
            <UInput
              v-model="state.name"
              :autofocus="mode === 'add'"
              class="w-full"
            />
          </UFormField>
          <UFormField label="คำอธิบาย" name="description">
            <UTextarea v-model="state.description" class="w-full" />
          </UFormField>
          <UFormField label="ราคา(฿)" name="price" required>
            <CurrencyInput v-model="state.price" :min="1" class="w-full" />
          </UFormField>
          <UFormField label="จำนวนในสต็อก" name="stock" required>
            <UInputNumber
              v-model="state.stock"
              :min="0"
              class="w-full"
              :format-options="{
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }"
            />
          </UFormField>
          <UFormField label="หมวดหมู่" name="category" required>
            <UInput v-model="state.category" class="w-full" />
          </UFormField>
          <UFormField label="URL รูปภาพ" name="imageUrl">
            <UInput v-model="state.imageUrl" class="w-full" />
          </UFormField>
          <UButton
            type="submit"
            size="xl"
            :loading="saving"
            :disabled="saving"
            :label="$t('SAVE')"
            class="justify-center"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { number, object, string } from "yup";

const { t } = useI18n();

const modelName = "สินค้า";
const isOpen = ref<boolean>(false);
const mode = ref<Mode>("add");
const saving = ref<boolean>(false);

const schema = object({
  name: string()
    .trim()
    .required(t("IS_REQUIRED", { text: t("NAME_", { text: modelName }) })),
  description: string().trim().notRequired(),
  price: number().required(t("IS_REQUIRED", { text: "ราคา" })),
  stock: number().required(t("IS_REQUIRED", { text: "จำนวนในสต็อก" })),
  category: string()
    .trim()
    .required(t("IS_REQUIRED", { text: "หมวดหมู่" })),
  imageUrl: string().trim().notRequired(),
});

const emits = defineEmits<{
  (event: "save", value: Product, mode?: Mode): void;
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
    name: "",
    description: "",
    category: "",
    imageUrl: "",
  };
};

const state = ref<Product>({
  name: "",
  description: "",
  category: "",
  imageUrl: "",
});

const onSave = async () => {
  saving.value = true;
  isOpen.value = false;
  emits("save", state.value, mode.value);
};

const show = async (data?: Product) => {
  saving.value = false;
  clearData();
  mode.value = "add";
  if (data) {
    mode.value = "edit";
    state.value = { ...state.value, ...data };
  }
  isOpen.value = true;
};

defineExpose({
  show,
});
</script>
