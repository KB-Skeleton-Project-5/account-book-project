<template>
  <div class="memo-write">
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="챌린지 다짐 메모"
    ></textarea>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const memoText = ref('');
</script>

<style scoped>
textarea {
  border-radius: 12px;
  background-color: #999999;
  padding: 20px;
  color: white;
  min-width: 100%;
}
</style>
