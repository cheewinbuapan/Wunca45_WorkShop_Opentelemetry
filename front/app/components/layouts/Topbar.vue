<script setup lang="ts">
import { capitalize } from "lodash";
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui";

const { t } = useI18n();
const localePath = useLocalePath();
const side = sidebar();
const auth = authen();
const ct = cart();

const breadcrumbItems = breadcrumbs();

const toggleDrawer = () => {
  side.drawer = !side.drawer;
};

const showSidebar = computed(
  () => auth.isAdmin() && useRoute().name?.toString().includes("admin"),
);

const profileItems: DropdownMenuItem[][] = [
  [
    {
      slot: "account",
      disabled: true,
      label: "",
    },
  ],
];
if (!auth.isAdmin() && profileItems[0]) {
  profileItems[0].push({
    label: "รายการสั่งซื้อของฉัน",
    icon: "i-fa6-solid-bag-shopping",
    to: localePath({ name: "my-orders" }),
  });
}

profileItems.push([
  {
    label: t("LOGOUT"),
    icon: "i-fa6-solid-right-from-bracket",
    to: localePath({ name: "logout" }),
  },
]);

const items = ref<NavigationMenuItem[]>([
  {
    label: "สินค้าทั้งหมด",
    icon: "i-fa6-solid-box",
    to: localePath({ name: "products" }),
  },
]);
</script>

<template>
  <div
    class="sticky top-0 z-10 flex flex-col bg-neutral-50/40 backdrop-blur-xl"
  >
    <div class="flex items-center justify-between bg-white px-5 py-2 shadow-sm">
      <div class="flex items-center gap-3">
        <UButton
          v-if="showSidebar"
          class="lg:hidden"
          color="neutral"
          variant="ghost"
          icon="i-fa6-solid-bars"
          @click="toggleDrawer"
        />
        <NuxtLink :to="useLocalePath()({ name: 'index' })">
          <img src="/images/logo.png" class="h-[30px] shrink-0" />
        </NuxtLink>
        <UNavigationMenu
          v-if="!auth.isAdmin()"
          :items
          :class="showSidebar ? 'lg:ml-52' : ''"
        />
      </div>
      <div class="flex items-center gap-2">
        <UChip
          v-if="ct.countProducts() > 0 && !auth.isAdmin()"
          :text="ct.countProducts()"
          size="3xl"
          :ui="{ base: 'p-0.5' }"
        >
          <UButton
            icon="i-fa6-solid-cart-shopping"
            color="neutral"
            variant="ghost"
            :to="localePath({ name: 'cart' })"
          />
        </UChip>
        <UButton
          v-else-if="!auth.isAdmin()"
          icon="i-fa6-solid-cart-shopping"
          color="neutral"
          variant="ghost"
          :to="localePath({ name: 'cart' })"
        />
        <UDropdownMenu
          :items="profileItems"
          :content="{
            align: 'end',
            side: 'bottom',
          }"
          :ui="{
            content: 'w-64 ring-0 rounded-lg bg-neutral-50 shadow-xl',
            item: 'data-disabled:cursor-text select-text',
          }"
        >
          <UButton
            icon="i-fa6-solid-user"
            variant="soft"
            color="neutral"
            :ui="{
              base: 'rounded-full p-2 shadow-md',
              leadingIcon: 'size-4.5',
            }"
          />

          <template #account="{}">
            <div class="w-full text-left">
              <div class="flex w-full items-baseline justify-between gap-2">
                <p class="truncate font-bold">
                  {{ capitalize(auth.user?.fullName || auth.user?.username) }}
                </p>
                <UBadge v-if="auth.isAdmin()" color="primary" label="Admin" />
              </div>
            </div>
          </template>

          <template #item="{ item }">
            <span class="truncate">{{ item.label }}</span>

            <UIcon
              :name="item.icon!"
              class="ms-auto h-4 w-4 flex-shrink-0 text-neutral-400 dark:text-neutral-500"
            />
          </template>
        </UDropdownMenu>
      </div>
    </div>
    <UBreadcrumb
      v-if="breadcrumbItems.hasItem()"
      :items="breadcrumbItems.items"
      :class="['px-10 py-1.5', showSidebar ? 'lg:ml-72' : '']"
    />
  </div>
</template>
