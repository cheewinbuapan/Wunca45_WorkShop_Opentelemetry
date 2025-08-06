<template>
  <UCard
    :ui="{
      root: 'rounded-none  divide-y-0 h-dvh ring-0 overflow-y-auto',
      header: 'p-2 sm:p-2',
      body: 'p-3 sm:p-3',
    }"
  >
    <template #header>
      <NuxtLink :to="useLocalePath()({ name: 'index' })">
        <img src="/images/logo.png" class="mx-auto h-[50px]" />
      </NuxtLink>
    </template>

    <UNavigationMenu
      orientation="vertical"
      class="h-full"
      :ui="{
        link: 'p-3',
        linkLeadingIcon: 'size-4',
        childLinkIcon: 'size-4',
      }"
      :items="useReferences().menus.menus"
    />
  </UCard>
</template>

<script setup lang="ts"></script>
