<script setup lang="ts">
import { find } from "lodash";
import { UInput } from "#components";
import Datepicker from "@vuepic/vue-datepicker";
import type { DatePickerInstance } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

interface Time {
  hours: number;
  minutes: number;
  seconds?: number;
}

const { locale, locales } = useI18n();

const props = withDefaults(
  defineProps<{
    modelValue?: string | null | string[];
    range?: boolean;
    prefixIcon?: string;
    enableSeconds?: boolean;
    minTime?: Time;
    maxTime?: Time;
    autoApply?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    readonly?: boolean;
  }>(),
  {
    enableSeconds: false,
    clearable: false,
    autoApply: false,
    disabled: false,
    readonly: false,
    prefixIcon: "i-fa6-solid-clock",
    range: false,
  },
);

const datepicker = ref<DatePickerInstance>(null);
const inputRender = useTemplateRef("inputRender");

const openCalendar = () => {
  if (datepicker.value) {
    datepicker.value?.openMenu();
  }
};

const renderValue = computed(() => {
  if (props.modelValue) {
    if (props.range) {
      return (props.modelValue as string[])
        ?.map((item: string) => {
          const splitTime = item.split(":");
          return `${splitTime[0]}:${splitTime[1]}${
            props.enableSeconds ? `:${splitTime[2]}` : ""
          }`;
        })
        .join(" - ");
    } else {
      return (props.modelValue as string)
        ?.split(":")
        ?.slice(0, 2)
        .join(":")
        ?.concat(
          props.enableSeconds
            ? `:${(props.modelValue as string).split(":")[2]}`
            : "",
        );
    }
  }
  return "";
});

const pickerValue = computed(() => {
  if (props.modelValue) {
    if (props.range && isArray(props.modelValue)) {
      return props.modelValue.map((item: string) => {
        const splitTime = item.split(":");
        return {
          hours: parseInt(splitTime[0]),
          minutes: parseInt(splitTime[1]),
          seconds: props.enableSeconds ? parseInt(splitTime[2]) : 0,
        };
      });
    } else {
      const splitTime = (props.modelValue as string).split(":");
      return {
        hours: parseInt(splitTime[0]),
        minutes: parseInt(splitTime[1]),
        seconds: props.enableSeconds ? parseInt(splitTime[2]) : 0,
      };
    }
  }
  return null;
});

const emits = defineEmits<{
  (
    e: "update:modelValue" | "input" | "change",
    value: null | string | string[],
  ): void;
  (e: "clear"): void;
}>();

const input = (val: Time | Time[]) => {
  const returnDateTime = props.range
    ? (val as Time[]).map(
        (item: Time) =>
          `${usePadStart(item.hours.toString(), 2, "0")}:${usePadStart(
            item.minutes.toString(),
            2,
            "0",
          )}:${
            props.enableSeconds
              ? `:${usePadStart(item.seconds?.toString(), 2, "0")}`
              : "00"
          }`,
      )
    : `${usePadStart((val as Time).hours.toString(), 2, "0")}:${usePadStart(
        (val as Time).minutes.toString(),
        2,
        "0",
      )}:${
        props.enableSeconds
          ? `:${usePadStart((val as Time).seconds?.toString(), 2, "0")}`
          : "00"
      }`;
  emits("update:modelValue", returnDateTime);
  emits("change", returnDateTime);
  emits("input", returnDateTime);
  inputRender.value?.inputRef?.focus();
  nextTick(() => {
    inputRender.value?.inputRef?.blur();
  });
};
const onClearable = (): void => {
  emits("update:modelValue", props.range ? [] : null);
  emits("change", props.range ? [] : null);
  emits("clear");
};
</script>

<template>
  <div>
    <UInput
      ref="inputRender"
      :model-value="renderValue"
      v-bind="{ ...$attrs }"
      readonly
      :disabled="disabled"
      @click="openCalendar"
    >
      <template #leading>
        <UButton
          color="neutral"
          size="xs"
          variant="link"
          :disabled="disabled"
          :icon="prefixIcon"
          :ui="{
            base: 'p-0',
          }"
          @click="openCalendar"
        />
      </template>
      <template v-if="clearable" #trailing>
        <UButton
          v-if="
            clearable &&
            modelValue &&
            (!isArray(modelValue) ||
              (isArray(modelValue) && modelValue.length === 2)) &&
            !disabled
          "
          color="neutral"
          size="xs"
          :disabled="disabled"
          variant="link"
          icon="i-fa6-solid-xmark"
          :ui="{
            base: 'p-0',
          }"
          @click="onClearable"
        />
      </template>
    </UInput>

    <Datepicker
      ref="datepicker"
      :model-value="pickerValue"
      time-picker
      :range="range"
      :disable-time-range-validation="range"
      :readonly="readonly"
      :disabled="disabled"
      :min-time="minTime"
      :max-time="maxTime"
      :auto-apply="autoApply"
      :locale="find(locales, { code: locale })!.iso as string"
      :select-text="$t('SELECT')"
      :cancel-text="$t('CANCEL')"
      :clearable="false"
      :enable-seconds="enableSeconds"
      @update:model-value="input"
    >
      <template #dp-input />
    </Datepicker>
  </div>
</template>
