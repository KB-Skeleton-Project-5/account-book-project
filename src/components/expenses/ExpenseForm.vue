<template>
  <div>
    <TabSelector @submit-tab="handleTab" />
    <DateInput @submit-date="handleDate" />
    <AmountInput @submit-amount="handleAmount" />
    <TitleInput @submit-title="handleTitle" />
    <TagSelect @submit-tag="handleTag" />
    <MemoInput @submit-memo="handleMemo" />
    <PaymentMethod @submit-payment="handlePayment" />
    <ToggleSwitch @submit-isFixed="handleIsFixed" />
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
import { ref } from 'vue';

const formData = ref({
  amount: '',
  date: '',
  title: '',
  memo: '',
  paymentMethod: '',
  isFixed: false,
  tag: '',
  type: '',
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

const emit = defineEmits(['submit-form']);

const submitForm = () => {
  emit('submit-form', formData.value);
};

defineExpose({ submitForm });
</script>
