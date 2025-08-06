<script setup lang="ts">
const localePath = useLocalePath();
const modelName = "สินค้าทั้งหมด";

const ct = cart();

definePageMeta({
  middleware: ["auth", "user"],
  validate: async (route) => {
    return typeof route.params.id === "string" && /^\d+$/.test(route.params.id);
  },
});

const id: number = Number.parseInt(useRoute().params.id as string);
const { show } = useProduct();
const { data, status } = await show(id);

useHead({
  title: data.value?.name!,
});

breadcrumbs().setItems([
  {
    label: modelName,
    to: localePath({ name: "products" }),
  },
  {
    label: data.value?.name!,
    to: localePath({ name: "products-id", params: { id } }),
  },
]);

const quantity = ref<number>(1);

const toast = useIToast();
const addToCart = () => {
  ct.addToCart(data.value!, quantity.value);
  toast.onSuccess(
    "เพิ่มสินค้าลงในรถเข็นแล้ว",
    `เพิ่มสินค้าลงในรถเข็น ${currencyText(quantity.value)} รายการแล้ว`,
    [
      {
        label: "ดูรถเข็น",
        icon: "i-fa6-solid-cart-shopping",
        color: "neutral",
        variant: "soft",
        to: localePath({ name: "cart" }),
      },
    ],
  );
  quantity.value = 1; // Reset quantity after adding to cart
};
</script>

<template>
  <UProgress v-if="status === 'pending'" animation="carousel" />
  <UCard v-else-if="data" class="w-full">
    <div class="flex items-start gap-5">
      <img
        v-if="data.imageUrl"
        :src="data.imageUrl"
        class="h-[500px] shrink-0 object-cover"
      />
      <div class="min-w-1/2 grow">
        <h2 class="line-clamp-2 text-3xl font-bold">{{ data.name }}</h2>
        <p class="text-lg font-bold">{{ data.category }}</p>
        <p class="text-neutral-500">{{ data.description }}</p>
        <div class="mt-3 flex items-baseline gap-3">
          <span class="text-5xl font-bold text-red-700">
            <span class="text-4xl">฿</span>{{ currencyText(data.price!) }}
          </span>
          <span class="text-sm text-neutral-500"
            >({{ currencyText(data.stock!) }} in stock)</span
          >
        </div>
        <div class="mt-5 flex items-center gap-3">
          <p>จำนวน</p>
          <UInputNumber
            v-model="quantity"
            class="w-32"
            :min="1"
            :disabled="data.stock! === 0"
            :max="data.stock!"
          />
        </div>
        <div class="mt-5">
          <UButton
            v-if="data.stock! > 0"
            color="primary"
            icon="i-fa6-solid-cart-plus"
            size="xl"
            class="px-6"
            label="เพิ่มไปยังรถเข็น"
            @click="addToCart"
          />
          <UButton
            v-else
            color="neutral"
            icon="i-fa6-solid-ban"
            size="xl"
            variant="soft"
            class="px-6"
            label="สินค้าหมด"
            disabled
          />
        </div>
      </div>
    </div>
  </UCard>
</template>
