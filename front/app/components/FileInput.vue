<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: any;
    oldFiles?: any;
    oldFileKey?: string;
    oldFileName?: string;
    oldFileUrl?: string;
    accept?: string;
    imageOnly?: boolean;
    multiple?: boolean;
    disabled?: boolean;
  }>(),
  {
    imageOnly: false,
    multiple: false,
    disabled: false,
    oldFileKey: "id",
    oldFileName: "name",
    oldFileUrl: "url",
  },
);
const dragOver = ref<boolean>(false);
const input = ref<HTMLInputElement | null>(null);

const emits = defineEmits<{
  (e: "update:modelValue" | "change", value: any): void;
  (e: "removeOldFile", value: number, index: number): void;
  (e: "clear"): void;
}>();

const selectFile = () => {
  const html = input.value as HTMLInputElement;
  html.value = "";
  input.value?.click();
};

const onFileChanged = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    keepData(props.multiple ? target.files : target.files[0]);
  }
};

const onDrop = (event: DragEvent) => {
  if (
    !props.disabled &&
    (props.multiple || (!props.multiple && !props.oldFiles))
  ) {
    dragOver.value = false;
    const dataTransfer = event.dataTransfer as DataTransfer;
    if (dataTransfer.files && dataTransfer.files.length > 0) {
      keepData(props.multiple ? dataTransfer.files : dataTransfer.files[0]);
    }
  }
};

const keepData = (file: any) => {
  if (props.multiple) {
    let payload: any[] = [];
    if (props.modelValue) {
      payload = [...props.modelValue];
    }
    payload = [...payload, ...file];
    emits("update:modelValue", payload);
    emits("change", file);
  } else {
    emits("update:modelValue", file);
    emits("change", file);
  }
};
const onRemoveFile = (index: number): void => {
  if (props.multiple) {
    const newModelValue = [...props.modelValue];
    newModelValue.splice(index, 1);
    emits("update:modelValue", newModelValue);
    emits("change", newModelValue);
    if (newModelValue.length === 0) {
      emits("clear");
    }
    return;
  } else {
    emits("update:modelValue", undefined);
    emits("change", undefined);
    emits("clear");
  }
};

const onRemoveOldFile = (key: number, index: number): void => {
  emits("removeOldFile", key, index);
};

const createObjectURL = (file: File) => {
  return URL.createObjectURL(file);
};
</script>

<template>
  <div
    :class="[
      'overflow-hidden rounded-md border border-neutral-300 bg-white shadow-sm focus-within:ring-1',
      disabled
        ? 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400'
        : dragOver
          ? 'border-primary ring-primary ring-1'
          : 'focus-within:border-primary focus-within:ring-primary text-neutral-500',
    ]"
    @drop.prevent="onDrop"
    @dragover.prevent="dragOver = !disabled"
    @dragenter.prevent="dragOver = !disabled"
    @dragleave.prevent="dragOver = false"
  >
    <input
      ref="input"
      type="file"
      :multiple="multiple"
      :accept="imageOnly ? 'image/*' : accept"
      hidden
      @input="onFileChanged($event)"
    />
    <button
      v-if="(!modelValue && !multiple && !oldFiles) || multiple"
      type="button"
      :class="[
        'inline-flex w-full items-center px-5 py-3',
        disabled ? 'cursor-not-allowed' : '',
      ]"
      :disabled="disabled"
      @click="selectFile"
    >
      <div class="flex items-center">
        <UIcon
          name="i-fa6-solid-cloud-arrow-up"
          class="text-xl"
          :class="['text-xl', dragOver && !disabled ? 'fa-bounce' : '']"
        />
        <div
          :class="[
            `ml-3 text-left text-sm`,
            dragOver && !disabled ? 'font-medium' : '',
          ]"
        >
          <p>
            {{ imageOnly ? $t("DRAG_IMAGES_HERE") : $t("DRAG_FILES_HERE") }}
            {{ $t("OR") }}
            {{
              imageOnly ? $t("CLICK_BROWSE_IMAGES") : $t("CLICK_BROWSE_FILES")
            }}
          </p>
        </div>
      </div>
    </button>
    <div v-if="modelValue || multiple" class="m-0 w-full">
      <hr
        v-if="
          multiple &&
          ((modelValue && modelValue.length > 0) ||
            (oldFiles && oldFiles.length > 0))
        "
        class="text-neutral-300"
      />
      <div
        v-for="(oldFile, index) in oldFiles"
        :key="index"
        class="flex w-full px-3 py-2 hover:bg-neutral-100"
      >
        <div class="flex w-full grow text-neutral-500">
          <FileIcon
            :name="oldFile[oldFileName] || oldFile[oldFileUrl]"
            :url="oldFile[oldFileUrl]"
            class="shrink-0"
          />
          <div
            class="ml-3 max-w-xs text-left sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"
          >
            <p v-if="oldFile[oldFileName]" class="truncate text-sm font-medium">
              {{ oldFile[oldFileName] }}
            </p>
            <a
              :href="oldFile[oldFileUrl]"
              target="_blank"
              class="text-info text-xs"
            >
              {{ $t("VIEW_FILE") }}
            </a>
          </div>
        </div>
        <div
          v-if="!disabled"
          class="flex w-5 shrink-0 items-center justify-center"
        >
          <UIcon
            name="i-fa6-regular-circle-xmark"
            class="hover:text-neutral-dark cursor-pointer text-neutral-300"
            @click="onRemoveOldFile(oldFile[oldFileKey!], index)"
          />
        </div>
      </div>
      <div
        v-for="(file, index) in multiple ? modelValue : [modelValue]"
        :key="index"
        class="flex w-full px-3 py-2 hover:bg-neutral-100"
      >
        <div class="flex w-full grow">
          <FileIcon
            :name="file.name"
            :url="createObjectURL(file)"
            class="shrink-0"
          />
          <div
            class="ml-3 max-w-xs text-left sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"
          >
            <p class="truncate text-sm font-medium">
              {{ file.name }}
            </p>
            <p class="text-xs">
              {{ formatBytes(file.size) }}
            </p>
          </div>
        </div>
        <div class="flex w-5 shrink-0 items-center justify-center">
          <UIcon
            name="i-fa6-regular-circle-xmark"
            class="hover:text-neutral-dark cursor-pointer text-neutral-300"
            @click="onRemoveFile(index)"
          />
        </div>
      </div>
    </div>
    <div v-else-if="!modelValue && !multiple && oldFiles" class="m-0 w-full">
      <div class="flex w-full px-3 py-2 hover:bg-neutral-100">
        <div class="flex w-full grow">
          <FileIcon
            :name="oldFiles[oldFileName] || oldFiles[oldFileUrl]"
            :url="oldFiles[oldFileUrl]"
            class="shrink-0"
          />
          <div
            class="ml-3 max-w-xs text-left sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"
          >
            <p
              v-if="oldFiles[oldFileName]"
              class="truncate text-sm font-medium"
            >
              {{ oldFiles[oldFileName] }}
            </p>
            <a
              :href="oldFiles[oldFileUrl]"
              target="_blank"
              class="text-info text-xs"
            >
              {{ $t("VIEW_FILE") }}
            </a>
          </div>
        </div>
        <div
          v-if="!disabled"
          class="flex w-5 shrink-0 items-center justify-center"
        >
          <UIcon
            name="i-fa6-regular-circle-xmark"
            class="hover:text-neutral-dark cursor-pointer text-neutral-300"
            @click="onRemoveOldFile(oldFiles[oldFileKey!], 0)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
