<template>
    <div>
        <TabSelector />
        <DateInput/>
        <AmountInput />
        <TitleInput />
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

</script>