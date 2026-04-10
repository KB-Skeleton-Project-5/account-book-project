<template>
  <div>
    <TabSelector 
    :value="formData.type" 
    @submit-tab="handleTab"
    :readonly="props.readonly" />
    <DateInput 
    :value="formData.date" 
    @submit-date="handleDate"
    :readonly="props.readonly" />
    <AmountInput 
    :value="formData.amount" 
    @submit-amount="handleAmount"
    :readonly="props.readonly" />
    <TitleInput 
    :value="formData.title" 
    @submit-title="handleTitle"
    :readonly="props.readonly" />
    <TagSelect 
    :value="formData.tag" 
    @submit-tag="handleTag" 
    :readonly="props.readonly"/>
    <MemoInput 
    :value="formData.memo" 
    @submit-memo="handleMemo" 
    :readonly="props.readonly"/>
    <PaymentMethod
      :value="formData.paymentMethod"
      @submit-payment="handlePayment"
      :readonly="props.readonly"
    />
    <ToggleSwitch 
    :value="formData.isFixed" 
    @submit-isFixed="handleIsFixed"
    :readonly="props.readonly" />
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
  readonly : Boolean,
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
  // 필수값 검사
  if(!formData.value.type?.typetitle) {
    alert('분류를 선택해주세요.');
    return
  }
  if(!formData.value.date) {
    alert('날짜를 선택해주세요.')
    return
  }
  if(!formData.value.amount) {
    alert('금액을 입력해주세요.')
    return
  }
  if(!formData.value.title) {
    alert('제목을 입력해주세요.')
    return
  }
  if(!formData.value.paymentMethod) {
    alert('결제수단을 선택해주세요.')
    return
  }

  emit('submit-form', formData.value);
};

defineExpose({ submitForm });
</script>
