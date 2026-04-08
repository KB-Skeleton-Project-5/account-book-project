<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="가계부 HOME" />
    </template>

    <p>메인 콘텐츠 자리</p>

    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';
</script>
