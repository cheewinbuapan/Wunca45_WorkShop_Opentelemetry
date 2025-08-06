<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script setup lang="ts">
const props = defineProps<{
  events: any[];
}>();
const { $fullCalendar } = useNuxtApp();
const FullCalendar = $fullCalendar();

const calendarOptions = computed(() => ({
  ...FullCalendar.options,
  initialView: "dayGridMonth",
  events: props.events,
  datesSet: (info: any) => {
    emits("change", info);
  },
  eventClick: (info: any) => {
    emits("event-click", info);
  },
  dateClick: (info: any) => {
    emits("date-click", info);
  },
  select: (info: any) => {
    emits("select", info);
  },
}));

const emits = defineEmits<{
  (e: "change" | "event-click" | "date-click" | "select", value: any): void;
}>();
</script>
