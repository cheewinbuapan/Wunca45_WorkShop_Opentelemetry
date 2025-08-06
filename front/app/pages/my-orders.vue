<script setup lang="ts">
import type { AlertDialog } from "#components";
import { padStart, find } from "lodash";
definePageMeta({
  middleware: ["auth", "user"],
});

const orderStatuses = useReferences().orderStatuses;

const modelName = "รายการสั่งซื้อของฉัน";

useHead({
  title: modelName,
});

breadcrumbs().clear();

const queryString = ref({
  status: "",
});
const filterStatus = ref<string>("all");
watch(filterStatus, (newStatus) => {
  queryString.value.status = newStatus === "all" ? "" : newStatus;
});

const columns = [
  {
    accessorKey: "id",
    header: "รหัสการสั่งซื้อ",
  },
  {
    accessorKey: "quantity",
    header: "จำนวนสินค้า",
  },
  {
    accessorKey: "totalPrice",
    header: "ราคารวม",
  },
  {
    accessorKey: "status",
    header: " สถานะ",
  },
  {
    id: "expand",
  },
  {
    id: "actions",
  },
];

const expanded = ref();

const { all, update } = useOrder();
const { data, status, refresh } = await all(queryString);

const toast = useIToast();
const changeStatus = ref<InstanceType<typeof AlertDialog> | null>(null);
const onCancelOrder = (order: Order) => {
  changeStatus.value?.show(
    undefined,
    order,
    "ยกเลิกการสั่งซื้อ",
    `คุณต้องการยกเลิกการสั่งซื้อ ${padStart(String(order.id!), 6, "0")} หรือไม่?`,
  );
};
const onSaveChangeStatus = async (order: Order) => {
  await update(order.id!, { status: "cancel" });
  toast.onSuccess(
    "ยกเลิกการสั่งซื้อ",
    `ยกเลิกการสั่งซื้อ ${padStart(String(order.id!), 6, "0")} แล้ว`,
  );
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
            {{ modelName }}
          </h2>
        </div>
        <div
          class="flex grow justify-between gap-3 max-md:flex-col md:items-end"
        >
          <UTabs
            v-model="filterStatus"
            :content="false"
            :items="[{ value: 'all', label: 'ทั้งหมด' }, ...orderStatuses]"
            class="w-full"
          />
        </div>
      </div>
    </template>

    <UTable
      v-model:expanded="expanded"
      :data
      :columns="columns"
      :loading="status === 'pending'"
    >
      <template #id-cell="{ row }">
        {{ padStart(String(row.original.id!), 6, "0") }}
      </template>
      <template #quantity-cell="{ row }">
        {{ row.original.orderDetails.length }} รายการ
        {{
          row.original.orderDetails.reduce((total, item) => {
            return total + item.quantity;
          }, 0)
        }}
        ชิ้น
      </template>
      <template #totalPrice-header="{ column }">
        <p class="text-right">
          {{ column.columnDef.header }}
        </p>
      </template>
      <template #totalPrice-cell="{ row }">
        <p class="text-right">
          <span class="text-xs">฿</span
          >{{
            currencyText(
              row.original.orderDetails.reduce((total, item) => {
                return total + item.price! * item.quantity;
              }, 0),
            )
          }}
        </p>
      </template>
      <template #status-header="{ column }">
        <p class="text-center">
          {{ column.columnDef.header }}
        </p>
      </template>
      <template #status-cell="{ row }">
        <p class="text-center">
          {{ find(orderStatuses, { value: row.original.status })?.label }}
        </p>
      </template>
      <template #expand-cell="{ row }">
        <UButton
          icon="i-fa6-solid-chevron-down"
          size="xs"
          color="neutral"
          variant="ghost"
          square
          aria-label="Expand"
          :ui="{
            leadingIcon: [
              'transition-transform',
              row.getIsExpanded() ? 'duration-200 rotate-180' : '',
            ],
          }"
          @click="row.toggleExpanded()"
        />
      </template>
      <template #actions-cell="{ row }">
        <div class="flex flex-1 justify-end gap-3">
          <UButton
            v-if="row.original.status === 'pending'"
            color="neutral"
            size="xs"
            label="ยกเลิกการสั่งซื้อ"
            variant="soft"
            @click="onCancelOrder(row.original)"
          />
        </div>
      </template>
      <template #expanded="{ row }">
        <h3 class="mb-2 font-bold">รายละเอียดการสั่งซื้อ</h3>
        <ul class="mb-2">
          <li
            v-for="(detail, idx) in row.original.orderDetails"
            :key="idx"
            class="flex items-center justify-between border-b py-1 last:border-b-0"
          >
            <div class="flex items-center gap-3">
              <img
                v-if="detail.productImageUrl!"
                :src="detail.productImageUrl!"
                alt="Product Image"
                class="h-10 w-10 rounded object-cover"
              />
              <div>
                <span>{{ detail.productName }}</span>
                <span class="text-xs text-gray-500"
                  >x{{ currencyText(detail.quantity) }}</span
                >
                <div class="text-xs text-gray-400">
                  หมวดหมู่: {{ detail.productCategory || "-" }}
                </div>
              </div>
            </div>
            <span> ฿{{ currencyText(detail.price! * detail.quantity) }} </span>
          </li>
        </ul>
        <div class="flex justify-end font-bold">
          รวมทั้งหมด:
          <span class="ml-2 text-green-600">
            ฿{{
              currencyText(
                row.original.orderDetails.reduce(
                  (total, item) => total + item.price! * item.quantity,
                  0,
                ),
              )
            }}
          </span>
        </div>
      </template>
    </UTable>
  </UCard>
  <AlertDialog
    ref="changeStatus"
    type="confirm"
    confirm-btn-color="error"
    @confirm="onSaveChangeStatus"
  >
    <template #default="{ title, detail }">
      <div class="flex w-full flex-col gap-2 px-12 text-center">
        <p class="text-error-600 my-3 text-2xl font-bold">{{ title }}</p>
        <div class="flex flex-col gap-1">
          <p>{{ detail }}</p>
        </div>
      </div>
    </template>
  </AlertDialog>
</template>
