<template>
  <div>
    <AppHeader />
    <router-view />
    <AppFooter />
  </div>
</template>

<script setup>
import AppFooter from './layouts/AppFooter.vue';
import AppHeader from './layouts/AppHeader.vue';
</script>

<style></style>
