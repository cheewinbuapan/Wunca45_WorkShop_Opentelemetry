<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";

definePageMeta({
  middleware: ["auth", "user"],
});

const { t } = useI18n();
const localePath = useLocalePath();

const modelName = "สินค้าทั้งหมด";

useHead({
  title: modelName,
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

const { all } = useProduct();
const { data, status } = await all(queryString);

const viewDetail = (item: Product) => {
  useRouter().push(
    localePath({ name: "products-id", params: { id: item.id } }),
  );
};
</script>

<template>
  <div class="flex w-full flex-col gap-5">
    <h2
      class="shrink-0 text-center text-2xl leading-tight font-bold text-neutral-900 dark:text-white"
    >
      {{ modelName }}
    </h2>
    <UInput
      v-model="q"
      leading-icon="i-fa6-solid-magnifying-glass"
      class="w-full self-center md:w-1/2"
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
    <div
      class="grid gap-3 py-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      <CustomsProductCard
        v-for="item in data"
        :key="item.id"
        :data="item"
        @click="viewDetail(item)"
      />
    </div>
  </div>
</template>
