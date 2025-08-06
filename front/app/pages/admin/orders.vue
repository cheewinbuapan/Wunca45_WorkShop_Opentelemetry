<script setup lang="ts">
import type { AlertDialog } from "#components";
import { padStart, find } from "lodash";
definePageMeta({
  middleware: ["auth", "admin"],
});

const { t } = useI18n();

const orderStatuses = useReferences().orderStatuses;

const modelName = "การสั่งซื้อ";
const pageName = t("MANAGES_", { text: modelName });

useHead({
  title: pageName,
});

breadcrumbs().clear();

const queryString = ref({
  status: "",
});
const filterStatus = ref<string>("all");
watch(filterStatus, (newStatus) => {
  queryString.value.status = newStatus === "all" ? "" : newStatus;
  selectedOrderIds.value = [];
});

const columns = [
  {
    id: "select",
  },
  {
    accessorKey: "id",
    header: "รหัสการสั่งซื้อ",
  },
  {
    accessorKey: "user",
    header: "ผู้สั่งซื้อ",
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
];

const expanded = ref();

const { all, update } = useOrder();
const { data, status, refresh } = await all(queryString);

const selectedOrderIds = ref<number[]>([]);
const onSelectOrder = (orderId: number) => {
  if (selectedOrderIds.value.includes(orderId)) {
    selectedOrderIds.value = selectedOrderIds.value.filter(
      (id) => id !== orderId,
    );
  } else {
    selectedOrderIds.value.push(orderId);
  }
};
const toggleSelectAll = () => {
  const pendingOrders = data.value!.filter((item) => item.status === "pending");
  if (selectedOrderIds.value.length === pendingOrders.length) {
    selectedOrderIds.value = [];
  } else {
    selectedOrderIds.value = pendingOrders.map((item) => item.id!);
  }
};

const toast = useIToast();
const changeStatus = ref<InstanceType<typeof AlertDialog> | null>(null);
const onChangeStatus = (newStatus: OrderStatus) => {
  changeStatus.value?.show(
    undefined,
    newStatus,
    find(orderStatuses, { value: newStatus })?.label,
    `คุณต้องการเปลี่ยนสถานะการสั่งซื้อ ${selectedOrderIds.value.length} รายการ เป็น ${find(orderStatuses, { value: newStatus })?.label} หรือไม่?`,
  );
};
const onSaveChangeStatus = async (newStatus: OrderStatus) => {
  await Promise.all(
    selectedOrderIds.value.map((orderId) => {
      return update(orderId, { status: newStatus });
    }),
  );
  toast.onSuccess(
    "เปลี่ยนสถานะการสั่งซื้อแล้ว",
    `เปลี่ยนสถานะการสั่งซื้อ ${selectedOrderIds.value.length} รายการ เป็น ${find(orderStatuses, { value: newStatus })?.label} แล้ว`,
  );
  selectedOrderIds.value = [];
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
        <div
          v-if="selectedOrderIds.length > 0"
          class="flex flex-1 justify-start gap-2"
        >
          <UButton
            icon="i-fa6-solid-check"
            color="success"
            label="ยืนยันการสั่งซื้อ"
            @click="onChangeStatus('confirm')"
          />
          <UButton
            icon="i-fa6-solid-xmark"
            color="error"
            label="ปฏิเสธการสั่งซื้อ"
            @click="onChangeStatus('reject')"
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
      <template #select-header>
        <UCheckbox
          v-if="data.filter((item) => item.status === 'pending').length > 0"
          :model-value="
            selectedOrderIds.length > 0 &&
            selectedOrderIds.length <
              data.filter((item) => item.status === 'pending').length
              ? 'indeterminate'
              : selectedOrderIds.length ===
                data.filter((item) => item.status === 'pending').length
          "
          @change="toggleSelectAll()"
        />
      </template>
      <template #select-cell="{ row }">
        <UCheckbox
          v-if="row.original.status === 'pending'"
          :model-value="selectedOrderIds.includes(row.original.id!)"
          @change="onSelectOrder(row.original.id!)"
        />
      </template>
      <template #id-cell="{ row }">
        {{ padStart(String(row.original.id!), 6, "0") }}
      </template>
      <template #user-cell="{ row }">
        <p class="font-bold">
          {{ row.original.user?.fullName }}
        </p>
        <p class="text-xs">
          <span class="font-bold"> Username : </span>
          {{ row.original.user?.username }}
        </p>
        <p class="text-xs">
          <span class="font-bold"> เบอร์โทรศัพท์ : </span>
          {{ row.original.user?.phone }}
        </p>
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
