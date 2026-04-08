<template>
  <button class="custom-btn">
    {{ props.label }}
  </button>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: '버튼', // 아무것도 안 보냈을 때만 이 글자가 뜹니다.
  },
});
</script>
