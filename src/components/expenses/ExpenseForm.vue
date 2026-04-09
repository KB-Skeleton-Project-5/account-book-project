<template>
    <div>
        <TabSelector />
        <DateInput @submit-date="handleDate"/>
        <AmountInput @submit-amount="handleAmount" />
        <TitleInput @submit-title="handleTitle"/>
        <TagSelect />
        <MemoInput />
        <PaymentMethod />
        <ToggleSwitch />
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
    amount : '',
    date : '',
    title : '',
});

const handleAmount = (value) => {
    formData.value.amount = value
}

const handleDate = (value) => {
    formData.value.date = value
}

const handleTitle = (value) => {
    formData.value.title = value
}
</script>