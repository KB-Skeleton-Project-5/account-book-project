<template>
  <div>
    <TabSelector :value="formData.type" @submit-tab="handleTab" />
    <DateInput :value="formData.date" @submit-date="handleDate" />
    <AmountInput :value="formData.amount" @submit-amount="handleAmount" />
    <TitleInput :value="formData.title" @submit-title="handleTitle" />
    <TagSelect :value="formData.tag" @submit-tag="handleTag" />
    <MemoInput :value="formData.memo" @submit-memo="handleMemo" />
    <PaymentMethod
      :value="formData.paymentMethod"
      @submit-payment="handlePayment"
    />
    <ToggleSwitch :value="formData.isFixed" @submit-isFixed="handleIsFixed" />
  </div>
</template>

<script setup>
import TabSelector from './TabSelector.vue';
import DateInput from './DateInput.vue';
import AmountInput from './AmountInput.vue';
import TitleInput from './TitleInput.vue';
import TagSelect from './TagSelect.vue';
import MemoInput from './MemoInput.vue';
import PaymentMethod from './PaymentMethod.vue';
import ToggleSwitch from './ToggleSwitch.vue';
import { ref, watch } from 'vue';

const formData = ref({
  amount: '',
  date: '',
  title: '',
  memo: '',
  paymentMethod: '',
  isFixed: false,
  tag: {},
  type: {},
});

const handleAmount = (value) => {
  formData.value.amount = value;
};

const handleDate = (value) => {
  formData.value.date = value;
};

const handleTitle = (value) => {
  formData.value.title = value;
};

const handleMemo = (value) => {
  formData.value.memo = value;
};

const handlePayment = (value) => {
  formData.value.paymentMethod = value;
};

const handleIsFixed = (value) => {
  formData.value.isFixed = value;
};

const handleTag = (value) => {
  formData.value.tag = value;
};

const handleTab = (value) => {
  formData.value.type = value;
};

// 부모 (ExpenseInfo)에서 전달받은 초기 데이터
const props = defineProps({
  initialData: Object,
});

// initialData가 들어오면 formData에 세팅
watch(
  () => props.initialData,
  (val) => {
    if (val) formData.value = { ...val };
    // immediate : 컴포넌트 생성 시 즉시 실행
  },
  { immediate: true },
);

const emit = defineEmits(['submit-form']);

const submitForm = () => {
  emit('submit-form', formData.value);
};

defineExpose({ submitForm });
</script>
