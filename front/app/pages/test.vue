<template>
  <UContainer class="flex gap-5 py-10">
    <UButton size="xl" label="Test Sentry" @click="throwError" />
    <UButton size="xl" class="gray" label="Test Exception" @click="exception" />
    <UButton size="xl" color="info" label="Test Message" @click="message" />
    <UButton
      size="xl"
      color="warning"
      label="Test Message Warning"
      @click="messageWarning"
    />
    <UButton
      size="xl"
      label="Test Message with Options"
      @click="messageWithOptions"
    />
    <UButton
      size="xl"
      color="success"
      label="Test Starting on Active Span"
      @click="startingOnActiveSpan"
    />
  </UContainer>
</template>

<script setup lang="ts">
import {
  captureException,
  captureMessage,
  startInactiveSpan,
} from "@sentry/nuxt";
definePageMeta({
  middleware: "blank",
});

function throwError() {
  throw new Error("ทดสอบว่า Error นะ");
}

function exception() {
  try {
    const result = JSON.parse('{"valid": true}');
    const value = result.invalidProperty.toUpperCase();
  } catch (error) {
    captureException(new Error("ทดสอบว่า Exception ว่า " + error));
  }
}

function message() {
  captureMessage("ทดสอบว่า Message นะ");
}

function messageWarning() {
  captureMessage("ทดสอบว่า Message Warning นะ", "warning");
}

function messageWithOptions() {
  captureMessage("Her father was not found", {
    level: "fatal",
    tags: {
      test: "test",
      type: "uncle",
    },
    user: {
      email: "unclesen_1952@scammer.co.kh",
      username: "sensy_kh",
    },
    extra: {
      foo: "bar",
      session: {
        token: "abcdef1234567890",
        expires: "2024-12-31T23:59:59Z",
        permissions: ["read", "write", "delete"],
      },
      items: [
        { id: 1, name: "Item A", price: 100, tags: ["tag1", "tag2"] },
        { id: 2, name: "Item B", price: 200, tags: ["tag3"] },
        { id: 3, name: "Item C", price: 300, tags: [] },
      ],
      meta: {
        requestId: "req-7890",
        timestamp: Date.now(),
        env: "development",
      },
    },
  });
}

async function startingOnActiveSpan() {
  const span = startInactiveSpan({
    name: "ทดสอบ Starting on Active Span",
    op: "test.operation",
  });
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("จบการทำงานของ Promise");
    }, 1234);
  });
  span.end();
}
</script>
