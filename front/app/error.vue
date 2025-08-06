<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

const setStatusTitle = (status: number) => {
  let title;
  switch (status) {
    case 400:
      title = "Bad Request";
      break;
    case 401:
      title = "Unauthorized";
      break;
    case 403:
      title = "Forbidden";
      break;
    case 404:
      title = "Not Found";
      break;
    case 405:
      title = "Method Not Allowed";
      break;
    case 408:
      title = "Request Timeout";
      break;
    case 413:
      title = "Request Entity Too Large";
      break;
    case 500:
      title = "Internal Server Error";
      break;
    case 502:
      title = "Bad Gateway";
      break;
    default:
      title = "An error occurred";
  }
  return title;
};

const { t } = useI18n();
const title = setStatusTitle(props.error?.statusCode!);
const detail = props.error?.statusCode
  ? t(`ERROR_TEXT_${props.error?.statusCode}`)
  : t("ERROR_TEXT_DEFAULT");

useHead({
  title: `${props.error?.statusCode} - ${title}`,
});

const handleError = () => {
  clearError({ redirect: "/" });
};

let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
const auth = authen();
if (props.error?.statusCode === 401) {
  await auth.logout();
  timeout = setTimeout(async () => {
    handleError();
  }, 5000);
}

onBeforeUnmount(() => {
  clearTimeout(timeout);
});
</script>

<template>
  <div
    v-if="error"
    class="flex min-h-screen items-center justify-center bg-neutral-100"
  >
    <div class="flex flex-col gap-3">
      <img src="/images/logo.png" class="mx-auto mb-5 w-[300px]" />
      <h1 class="text-center text-5xl font-semibold">
        {{ error.statusCode }}
      </h1>
      <h1 class="text-center text-3xl text-neutral-500">
        {{ title }}
      </h1>
      <p class="error-detail text-center text-3xl text-neutral-500">
        {{ detail }} {{ $t("PLEASE_CONTACT_STAFF") }}
      </p>
      <p
        v-if="error?.statusMessage"
        class="error-detail rounded-lg bg-red-100 px-5 py-3 text-center text-lg text-neutral-500"
      >
        {{ error?.statusMessage }}
      </p>
      <div class="flex items-center justify-center gap-2 text-neutral-500">
        <p class="title text-center">{{ $t("GO_TO_", { text: "" }) }}</p>
        <UButton
          variant="link"
          size="xl"
          label="Home page"
          @click="handleError"
        />
      </div>
    </div>
  </div>
</template>
