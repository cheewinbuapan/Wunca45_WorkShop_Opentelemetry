<template>
  <div class="flex flex-wrap items-center gap-3">
    <div class="flex items-center gap-x-2">
      <p class="text-neutral-500">
        {{ $t("ROWS_PER_PAGE") }}
      </p>
      <USelect
        v-model="pageSize"
        :items="
          showAll
            ? useReferences().rowsPerPages
            : useReferences().rowsPerPages.filter((ele) => ele.value !== -1)
        "
        class="w-24"
      />
    </div>
    <div v-if="isMultiplePage" class="flex items-center gap-x-2">
      <p class="text-neutral-500">
        {{ $t("PAGE") }}
      </p>
      <UPagination
        v-model:page="currentPage"
        :items-per-page="pageSize"
        :total="totalItem"
        show-edges
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  totalItem: number;
  totalPage: number;
  showAll?: boolean;
}>();

const currentPage = defineModel<number>("currentPage", { required: true });
const pageSize = defineModel<number>("pageSize", { required: true });

const isMultiplePage = computed(() => props.totalPage > 1);
</script>
