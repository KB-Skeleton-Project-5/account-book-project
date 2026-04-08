<template>
  <div class="app-wrapper">
    <div class="app-frame">
      <header class="app-header">
        <slot name="header" />
      </header>

      <main class="app-content">
        <slot />
      </main>

      <footer class="app-footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.app-wrapper {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  background-color: #f0f0f0;
}

.app-frame {
  width: 100%;
  max-width: 480px;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.app-header {
  flex-shrink: 0;
}

.app-content {
  flex: 1;
  overflow-y: auto;
}

.app-footer {
  flex-shrink: 0;
}
</style>
