<template>
  <div
    class="overflow-hidden rounded-xl shadow ring-1 ring-neutral-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <img
      :src="data.imageUrl || '/images/logo.png'"
      class="h-[270px] w-full object-cover"
    />
    <div class="flex flex-col gap-2 bg-white px-5 py-4">
      <p class="line-clamp-2 grow text-lg font-bold">{{ data.name }}</p>
      <p class="-mt-3 line-clamp-1 grow text-xs text-neutral-400">
        {{ data.category }}
      </p>

      <p class="text-right text-2xl font-bold text-red-700">
        <span class="text-xl">฿</span>{{ currencyText(data.price!) }}
      </p>
      <UButton
        v-if="data.stock! > 0"
        color="primary"
        icon="i-fa6-solid-cart-plus"
        size="xl"
        class="justify-center px-6"
        label="เพิ่มไปยังรถเข็น"
        @click.stop="addToCart"
      />
      <UButton
        v-else
        color="neutral"
        icon="i-fa6-solid-ban"
        size="xl"
        variant="soft"
        class="justify-center px-6"
        label="สินค้าหมด"
        disabled
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: Product;
}>();

const localePath = useLocalePath();
const ct = cart();

const toast = useIToast();
const addToCart = () => {
  ct.addToCart(props.data!, 1);
  toast.onSuccess(
    "เพิ่มสินค้าลงในรถเข็นแล้ว",
    `เพิ่มสินค้า ${props.data.name} ลงในรถเข็น ${currencyText(1)} รายการแล้ว`,
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
};
</script>
