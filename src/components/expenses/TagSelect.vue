<template>
    <div class="wrapper">
        <label>태그</label>
        <div class="tag-group">
            <button
            v-for="tag in tags"
            :key="tag.tagid"
            @click="handleSelect(tag)"
            :class="{ active: selected.tagid === tag.tagid }"
            class="tag-btn"
            >
            {{ tag.tagtitle }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const tags = [
  { tagid: 'eat', tagtitle: '식비' },
  { tagid: 'traffic', tagtitle: '교통비' },
  { tagid: 'shopping', tagtitle: '쇼핑' },
  { tagid: 'etc', tagtitle: '기타' }
]

const props = defineProps({
    value : [ Object ]
});

watch(() => props.value, (val) => {
    if(val !== undefined) tags.value = val;
}, { imediate : true });

const selected = ref(tags[0]);
const emit = defineEmits(['submit-tag']);

const handleSelect = (tag) => {
  selected.value = tag
  emit('submit-tag', tag)
}
</script>


<style scoped>
.wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 16px;
}
label {
    font-size: 0.9rem;
    color: #545045;
    min-width: 40px;
}
.tag-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}
.tag-btn {
    padding: 6px 16px;
    border: 1px solid #EBEBEB;
    border-radius: 20px;
    background-color: #ffffff;
    color: #9e9e9e;
    font-size: 0.85rem;
    cursor: pointer;
}
.tag-btn.active {
    background-color: #FCF2D0;
    color: #545045;
    border-color: #FFBC00;
}
</style>