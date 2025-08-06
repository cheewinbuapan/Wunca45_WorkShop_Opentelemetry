<template>
  <div class="relative h-40 w-40">
    <UAvatar
      :src="displayImage || props.src"
      icon="i-fa6-solid-user"
      class="relative shadow-md"
      :ui="{
        size: { sm: 'h-40 w-40 object-cover' },
        icon: { size: { sm: 'h-24 w-24' } },
      }"
    />
    <div class="absolute bottom-1 right-2 cursor-pointer" @click="selectFile">
      <UTooltip :text="$t('CHANGE', { text: $t('PROFILE_IMAGE') })">
        <UAvatar
          alt="Avatar"
          :icon="displayImage ? 'i-fa6-solid-repeat' : 'i-fa6-solid-image'"
          size="sm"
          :ui="{
            background: displayImage ? 'bg-primary-400' : 'bg-primary-500',
            icon: { base: 'text-white' },
          }"
          class="shadow-md transition-all duration-200"
        />
      </UTooltip>
    </div>
    <div
      :class="[
        'absolute -bottom-3 inset-x-1/2 cursor-pointer',
        ' transition-all duration-200',
        displayImage ? 'scale-100' : 'scale-0',
      ]"
      @click="clearFile"
    >
      <UTooltip class="-translate-x-1/2" :text="$t('CANCEL')">
        <UAvatar
          alt="Avatar"
          icon="i-fa6-solid-xmark"
          size="sm"
          :ui="{ icon: { base: 'text-neutral-600' } }"
          class="shadow-md"
        />
      </UTooltip>
    </div>
    <div
      :class="[
        'absolute bottom-10 -right-3 cursor-pointer',
        ' transition-all duration-200',
        displayImage && !hideUploadButton ? 'scale-100' : 'scale-0',
      ]"
      @click="uploadFile"
    >
      <UTooltip :text="$t('UPLOAD')">
        <UAvatar
          alt="Avatar"
          icon="i-fa6-solid-upload"
          size="sm"
          :ui="{ background: 'bg-primary-500', icon: { base: 'text-white' } }"
          class="shadow-md"
        />
      </UTooltip>
    </div>
    <input
      ref="input"
      type="file"
      accept="image/*"
      hidden
      @input="onFileChanged($event)"
    />
  </div>
</template>

<script setup lang="ts">
const model = defineModel<File>();
const props = withDefaults(
  defineProps<{
    src?: string;
    hideUploadButton?: boolean;
  }>(),
  {
    hideUploadButton: false,
  }
);
const input = ref<HTMLInputElement | null>(null);
const displayImage = ref<string>("");

const emits = defineEmits<{
  (e: "change", value?: File): void;
  (e: "upload", value: File): void;
}>();

const selectFile = () => {
  const html = input.value as HTMLInputElement;
  html.value = "";
  input.value?.click();
};
const onFileChanged = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    displayImage.value = createObjectURL(target.files[0]);
    keepData(target.files[0]);
  }
};
const keepData = (file: File) => {
  model.value = file;
  emits("change", file);
};

const createObjectURL = (file: File) => {
  return URL.createObjectURL(file);
};

const clearFile = () => {
  displayImage.value = "";
  model.value = undefined;
  emits("change", undefined);
};
const uploadFile = () => {
  displayImage.value = "";
  emits("upload", model.value!);
};
</script>
