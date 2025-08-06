<script setup lang="ts">
import { object, string } from "yup";

const { t } = useI18n();
const localePath = useLocalePath();
const auth = authen();
const modelName = t("SIGNUP");

definePageMeta({
  layout: "blank",
  middleware: "guest",
});
useHead({
  title: modelName,
});
breadcrumbs().clear();

const state = reactive<Signup>({
  fullName: "",
  phone: "",
  username: "",
  password: "",
  confirmPassword: "",
});
const showPassword = ref<boolean>(false);
const showPasswordConfirmation = ref<boolean>(false);

const schema = object({
  fullName: string()
    .trim()
    .required(t("IS_REQUIRED", { text: "ชื่อ-นามสกุล" })),
  phone: string()
    .trim()
    .required(t("IS_REQUIRED", { text: t("PHONE_NUMBER") })),
  username: string()
    .trim()
    .required(t("IS_REQUIRED", { text: "Username" })),
  password: string()
    .trim()
    .test(
      "is-valid-password",
      t("INVALID_PASSWORD"),
      (value: any) =>
        !value ||
        (!!value && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(value)),
    )
    .required(t("IS_REQUIRED", { text: t("NEW_", { text: " Password " }) })),
  confirmPassword: string()
    .trim()
    .test(
      "is-password-match",
      t("PASSWORD_NOT_MATCH"),
      (value: any) =>
        !state.password || (!!state.password && value === state.password),
    ),
});

const { error, status, signup } = await auth.signup(state);

const toast = useIToast();
const onSignup = async () => {
  await signup();
  if (error.value) {
    toast.onError(error.value.statusCode!, error.value.data.message);
  } else {
    toast.onSuccess("ลงทะเบียนสำเร็จ", "กรุณา Login เพื่อใช้งานระบบ");
    useRouter().replace(
      localePath({
        name: "login",
      }),
    );
  }
};
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-100">
    <UForm
      :state
      :schema
      class="flex flex-col items-center gap-8"
      @submit="onSignup"
    >
      <img src="/images/logo.png" class="h-[100px]" />
      <UCard
        class="w-80 max-w-80 shadow-xl"
        :ui="{
          root: 'ring-0',
          footer: 'flex flex-col gap-5',
        }"
      >
        <template #header>
          <p class="text-center text-xl font-bold">
            {{ modelName }}
          </p>
        </template>
        <div class="flex flex-col gap-3">
          <UFormField label="ชื่อ-นามสกุล" name="fullName">
            <UInput
              v-model="state.fullName"
              autofocus
              class="w-full"
              :disabled="status === 'pending'"
            />
          </UFormField>
          <UFormField :label="t('PHONE_NUMBER')" name="phone">
            <UInput
              v-model="state.phone"
              v-maska
              class="w-full"
              :disabled="status === 'pending'"
              data-maska="0## ### ####"
              placeholder="0XX XXX XXXX"
            />
          </UFormField>
          <UFormField label="Username" name="username">
            <UInput
              v-model="state.username"
              class="w-full"
              :disabled="status === 'pending'"
              autocomplete="off"
            />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full"
              :disabled="status === 'pending'"
              autocomplete="off"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="xs"
                  :icon="
                    showPassword ? 'i-fa6-solid-eye' : 'i-fa6-solid-eye-slash'
                  "
                  :ui="{
                    base: 'p-0',
                  }"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>
          <UFormField :label="t('CONFIRM_PASSWORD')" name="confirmPassword">
            <UInput
              v-model="state.confirmPassword"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              class="w-full"
              :disabled="status === 'pending'"
              autocomplete="off"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="xs"
                  :icon="
                    showPasswordConfirmation
                      ? 'i-fa6-solid-eye'
                      : 'i-fa6-solid-eye-slash'
                  "
                  :ui="{
                    base: 'p-0',
                  }"
                  @click="showPasswordConfirmation = !showPasswordConfirmation"
                />
              </template>
            </UInput>
          </UFormField>
        </div>

        <template #footer>
          <UButton
            type="submit"
            block
            size="lg"
            :label="t('SIGNUP')"
            :disabled="status === 'pending'"
            :loading="status === 'pending'"
          />

          <NuxtLink :to="localePath({ name: 'login' })">
            <p class="text-center text-xs font-bold text-neutral-400">
              {{ t("GO_TO_", { text: t("LOGIN") }) }}
            </p>
          </NuxtLink>
        </template>
      </UCard>
    </UForm>
  </div>
</template>
