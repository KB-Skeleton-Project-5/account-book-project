<template>
  <div class="ChallengeCard">
    <header>
      <h2>{{ challengeName }}</h2>
    </header>
    <ProgressBar :current="props.current" :total="props.total" />
    <ChallengeDescription />
    <div class="percentage">{{ percentage }}%</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProgressBar from './ProgressBar.vue';
import ChallengeDescription from './ChallengeDescription.vue';

const props = defineProps({
  challengeName: {
    type: String,
    default: '챌린지 이름',
  },
  current: {
    type: Number,
    required: true,
    default: 27,
  },
  total: {
    type: Number,
    required: true,
    default: 50,
  },
});

const percentage = computed(() => {
  return (props.current / props.total) * 100;
});
</script>

<style scoped>
.ChallengeCard {
  display: flex;
  flex-direction: column;
  border: 5px solid black;
  background-color: white;
}
.percentage {
  align-self: flex-end;
}
</style>
