<script setup lang="ts">
import { find } from "lodash";
import { UInput } from "#components";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const { locale, locales } = useI18n();

const props = withDefaults(
  defineProps<{
    modelValue?: string | null | Date | string[];
    range?: boolean;
    minDate?: string | Date;
    maxDate?: string | Date;
    weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    prefixIcon?: string;
    dateOnly?: boolean;
    enableSeconds?: boolean;
    beYear?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    readonly?: boolean;
  }>(),
  {
    weekStart: 0,
    dateOnly: false,
    enableSeconds: false,
    beYear: false,
    clearable: false,
    disabled: false,
    readonly: false,
    prefixIcon: "i-fa6-solid-calendar-days",
    range: false,
  },
);

const openCalendar = ref<boolean>(false);

const renderValue = computed(() => {
  if (
    props.modelValue &&
    (!isArray(props.modelValue) ||
      (isArray(props.modelValue) && props.modelValue.length === 2))
  ) {
    if (props.range && isArray(props.modelValue)) {
      return `${datetime.toText(
        props.modelValue[0],
        "medium",
        props.dateOnly ? null : props.enableSeconds ? "long" : "short",
      )}${
        (!props.dateOnly && props.modelValue[0] === props.modelValue[1]) ||
        (props.dateOnly &&
          datetime
            .dt(datetime.format(props.modelValue[0], "YYYY-MM-DD"))
            .format() ===
            datetime
              .dt(datetime.format(props.modelValue[1], "YYYY-MM-DD"))
              .format())
          ? ""
          : ` - ${datetime.toText(
              props.modelValue[1],
              "medium",
              props.dateOnly ? null : props.enableSeconds ? "long" : "short",
            )}`
      }`;
    } else {
      return datetime.toText(
        props.modelValue as string,
        "medium",
        props.dateOnly ? null : props.enableSeconds ? "long" : "short",
      );
    }
  }
  return "";
});

const emits = defineEmits<{
  (
    e: "update:modelValue" | "input" | "change",
    value: null | string | string[],
  ): void;
  (e: "blur", value: string | string[]): void;
  (e: "clear"): void;
}>();

const setReturnDatetime = (val: Date | Date[]) => {
  if (props.range && Array.isArray(val)) {
    const returnStartDateTime = props.dateOnly
      ? datetime.dt(datetime.format(val[0] as Date, "YYYY-MM-DD")).format()
      : datetime.dt(val[0] as Date).format();
    const returnEndDateTime = props.dateOnly
      ? datetime
          .dt(datetime.format(val[1] as Date, "YYYY-MM-DD"))
          .add(23, "h")
          .add(59, "m")
          .add(59, "s")
          .format()
      : datetime.dt(val[1] as Date).format();
    return [returnStartDateTime, returnEndDateTime];
  } else {
    const returnDateTime = props.dateOnly
      ? datetime.dt(datetime.format(val as Date, "YYYY-MM-DD")).format()
      : datetime.dt(val as Date).format();
    return returnDateTime;
  }
};

const input = (val: Date | Date[]) => {
  const returnDateTime = setReturnDatetime(val);
  emits("update:modelValue", returnDateTime);
  emits("change", returnDateTime);
  emits("input", returnDateTime);
  openCalendar.value = false;
};
const blur = (val: Date) => {
  const returnDateTime = setReturnDatetime(val);
  emits("blur", returnDateTime);
  openCalendar.value = false;
};
const onClearable = (): void => {
  emits("update:modelValue", props.range ? [] : null);
  emits("change", props.range ? [] : null);
  emits("clear");
};
</script>

<template>
  <UPopover
    v-model:open="openCalendar"
    arrow
    :content="{ sideOffset: 2 }"
    :ui="{ content: 'ring-0' }"
  >
    <template #anchor>
      <UInput
        :model-value="renderValue"
        v-bind="{ ...$attrs }"
        readonly
        :disabled="disabled"
        @click="openCalendar = !openCalendar"
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
            @click="openCalendar = !openCalendar"
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
    </template>

    <template #content>
      <Datepicker
        :model-value="modelValue"
        :range="range"
        :multi-calendars="range"
        :readonly="readonly"
        :disabled="disabled"
        :auto-apply="dateOnly"
        :min-date="minDate"
        :max-date="maxDate"
        :week-start="weekStart"
        inline
        :locale="find(locales, { code: locale })!.iso as string"
        :select-text="$t('SELECT')"
        :cancel-text="$t('CANCEL')"
        :action-row="{ showNow: true }"
        :now-button-label="dateOnly ? $t('TODAY') : $t('NOW')"
        time-picker-inline
        :clearable="false"
        :enable-time-picker="!dateOnly"
        :enable-seconds="enableSeconds"
        @update:model-value="input"
        @blur="blur"
      >
        <template #year="{ value }">
          {{ beYear || locale === "th" ? value + 543 : value }}
        </template>
        <template #year-overlay-value="{ text }">
          <div>
            {{ beYear || locale === "th" ? Number.parseInt(text) + 543 : text }}
          </div>
        </template>
        <template #dp-input />
      </Datepicker>
    </template>
  </UPopover>
</template>
