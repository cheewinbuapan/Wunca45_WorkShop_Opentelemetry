<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const auth = authen();
const router = useRouter();
const modelName = t("LOGIN");

definePageMeta({
  layout: "blank",
  middleware: "guest",
});
useHead({
  title: modelName,
});

const state = reactive({
  username: "",
  password: "",
});

const showPassword = ref<boolean>(false);

const invalid = ref<boolean>(false);
const inactive = ref<boolean>(false);

const clearInvalid = () => {
  invalid.value = false;
  inactive.value = false;
};

const { error, status, login } = await auth.login(state);

const onLogin = async () => {
  await login();
  if (error.value) {
    state.password = "";
    const statusCode = error.value.statusCode;
    [invalid.value, inactive.value] = [statusCode === 401, statusCode === 405];
  }
  if (status.value === "success") {
    router.push(localePath({ name: "index" }));
  }
};
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-100">
    <UForm :state class="flex flex-col items-center gap-8" @submit="onLogin">
      <img src="/images/logo.png" class="h-[100px]" />
      <UCard
        class="min-w-80 shadow-xl"
        :ui="{
          root: 'ring-0 divide-y-0',
          header: 'pb-0 flex flex-col pt-4 gap-5',
        }"
      >
        <div class="flex flex-col gap-5">
          <UFormField label="Username" name="username">
            <UInput
              v-model="state.username"
              :disabled="status === 'pending'"
              autocomplete="off"
              autofocus
              class="w-full"
              @input="clearInvalid"
            />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              :disabled="status === 'pending'"
              autocomplete="off"
              class="w-full"
              @input="clearInvalid"
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

          <p v-if="invalid" class="text-center text-sm font-bold text-red-500">
            {{ $t("INCORRECT", { text: "ผู้ใช้งาน" + $t("OR") + "รหัสผ่าน" }) }}
          </p>

          <p v-if="inactive" class="text-center text-sm font-bold text-red-500">
            {{ $t("USER_INACTIVE") }}
          </p>
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-1">
              <UButton
                type="submit"
                block
                size="lg"
                :label="modelName"
                :disabled="
                  status === 'pending' || !state.username || !state.password
                "
                :loading="status === 'pending'"
                color="success"
              />
            </div>

            <UButton
              block
              size="lg"
              :label="t('SIGNUP')"
              :disabled="status === 'pending'"
              color="info"
              :to="localePath({ name: 'register' })"
            />
          </div>
        </div>
      </UCard>
    </UForm>
  </div>
</template>
