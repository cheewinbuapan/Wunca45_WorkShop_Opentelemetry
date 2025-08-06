<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { FormsProduct, AlertDialog } from "#components";

definePageMeta({
  middleware: ["auth", "admin"],
});

const { t } = useI18n();

const modelName = "สินค้า";
const pageName = t("MANAGES_", { text: modelName });

useHead({
  title: pageName,
});

breadcrumbs().clear();

const queryString = ref({
  q: "",
});
const q = ref<string>("");
const pendingSearch = ref<boolean>(false);
watch(q, () => {
  pendingSearch.value = true;
});
watchDebounced(
  q,
  (value) => {
    queryString.value.q = value;
    pendingSearch.value = false;
  },
  { debounce: 600, maxWait: 1000 },
);

const columns = [
  {
    accessorKey: "imageUrl",
    header: "รูปภาพสินค้า",
  },
  {
    accessorKey: "name",
    header: t("NAME_", { text: modelName }),
  },
  {
    accessorKey: "price",
    header: "ราคา",
  },
  {
    accessorKey: "stock",
    header: "จำนวนคงเหลือ",
  },
  {
    accessorKey: "category",
    header: "หมวดหมู่",
  },
  {
    id: "actions",
  },
];

const { all, create, update, destroy } = useProduct();
const { data, status, refresh } = await all(queryString);

const productForm = ref<InstanceType<typeof FormsProduct> | null>(null);
const createItem = () => {
  productForm.value?.show();
};
const updateItem = (data: Product) => {
  productForm.value?.show(data);
};

const toast = useIToast();
const onSave = async (data: Product, mode: Mode) => {
  const { error } =
    mode === "add" ? await create(data) : await update(data.id!, data);
  if (error.value) {
    toast.onError(error.value.statusCode!, error.value.data.message);
  } else {
    toast.onSuccess(
      mode === "add" ? t("ADDED") : t("UPDATED"),
      mode === "add"
        ? t("ADDED_", { text: modelName })
        : t("UPDATED_", { text: modelName }),
    );
  }
  refresh();
};

const alertDelete = ref<InstanceType<typeof AlertDialog> | null>(null);
const deleteItem = (data: Product) => {
  alertDelete.value?.show(`${modelName} : ${data.name}`, data.id);
};
const onDelete = async (id: number) => {
  const { error } = await destroy(id);
  if (error.value) {
    toast.onError(error.value.statusCode!, error.value.data.message);
  } else {
    toast.onDelete(t("DELETED"), t("DELETED_", { text: modelName }));
  }
  refresh();
};
</script>

<template>
  <UCard
    v-if="data"
    class="w-full"
    :ui="{
      header: 'p-4 sm:p-4',
      body: 'p-0 sm:p-0',
    }"
  >
    <template #header>
      <div class="flex flex-col gap-3">
        <div class="flex grow items-center justify-between gap-3">
          <h2
            class="shrink-0 text-xl leading-tight font-bold text-neutral-900 dark:text-white"
          >
            {{ pageName }}
          </h2>
          <UButton
            size="xs"
            icon="i-fa6-solid-plus"
            :label="$t('ADD_', { text: $t('NEW_', { text: modelName }) })"
            @click="createItem"
          />
        </div>
        <div
          class="flex grow justify-between gap-3 max-md:flex-col md:items-end"
        >
          <UInput
            v-model="q"
            leading-icon="i-fa6-solid-magnifying-glass"
            class="grow max-md:order-last"
            :placeholder="`${t('SEARCH_', { text: modelName })}`"
            :loading="status === 'pending' || pendingSearch"
          >
            <template #trailing>
              <UButton
                v-if="q"
                color="neutral"
                variant="link"
                size="xs"
                leading-icon="i-fa6-solid-xmark"
                @click="q = ''"
              />
            </template>
          </UInput>
        </div>
      </div>
    </template>

    <UTable
      :data
      :columns="columns"
      :loading="status === 'pending' || pendingSearch"
    >
      <template #imageUrl-cell="{ row }">
        <img
          v-if="row.original.imageUrl"
          :src="row.original.imageUrl"
          alt="Product Image"
          class="size-20 rounded object-cover"
        />
        <span v-else class="text-neutral-500">ไม่มีรูปภาพ</span>
      </template>
      <template #price-header="{ column }">
        <p class="text-right">
          {{ column.columnDef.header }}
        </p>
      </template>
      <template #price-cell="{ row }">
        <p class="text-right">
          <span class="text-xs">฿</span>{{ currencyText(row.original.price!) }}
        </p>
      </template>
      <template #stock-header="{ column }">
        <p class="text-right">{{ column.columnDef.header }}</p>
      </template>
      <template #stock-cell="{ row }">
        <p class="text-right">
          {{ currencyText(row.original.stock!) }}
        </p>
      </template>
      <template #actions-cell="{ row }">
        <div class="flex flex-1 justify-end gap-2">
          <UTooltip :text="$t('EDIT')">
            <UButton
              icon="i-fa6-solid-pen-to-square"
              color="warning"
              size="xs"
              variant="link"
              @click="updateItem(row.original as Product)"
            />
          </UTooltip>
          <UTooltip :text="$t('DELETE')">
            <UButton
              icon="i-fa6-solid-trash"
              color="error"
              size="xs"
              variant="link"
              @click="deleteItem(row.original as Product)"
            />
          </UTooltip>
        </div>
      </template>
    </UTable>
  </UCard>
  <FormsProduct ref="productForm" @save="onSave!" />
  <AlertDialog ref="alertDelete" type="delete" @confirm="onDelete" />
</template>
