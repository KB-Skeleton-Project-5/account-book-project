<template>
  <div class="wrapper">
    <label>🏷️ 태그</label>
    <div class="tag-group">
      <button
        v-for="tag in filteredTags"
        :key="tag.tagid"
        @click="handleSelect(tag)"
        :class="{ active: selected.tagid === tag.tagid }"
        class="tag-btn"
        :disabled="props.readonly"
      >
        {{ tag.tagtitle }}
      </button>
      <span v-if="filteredTags.length === 0" class="empty-tag">태그 없음</span>

      <!-- 태그 관리 모달 열기 버튼 (readonly가 아닐 때만 표시) -->
      <button
        v-if="!props.readonly"
        class="add-tag-btn"
        @click="showTagModal = true"
      >
        +
      </button>
    </div>
  </div>

  <!-- 태그 관리 모달 -->
  <TagModal
    v-if="showTagModal"
    @close="showTagModal = false"
    @updated="fetchTags"
  />
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { getTags } from '@/api/tags';
import TagModal from '@/components/tags/TagModal.vue';
import { getUserInfo } from '@/util/authUtil';

const tags = ref([]);
const selected = ref({});
const showTagModal = ref(false);
const emit = defineEmits(['submit-tag']);
const userInfo = getUserInfo();

const props = defineProps({
  value: [Object],
  readonly: Boolean,
  // 수입 or 지출 — TabSelector에서 선택한 typetitle
  type: {
    type: String,
    default: '',
  },
});

// type에 따라 태그 필터링 (type 없으면 전체 표시)
const filteredTags = computed(() => {
  if (!props.type) return tags.value;
  return tags.value.filter((t) => t.type === props.type);
});

const fetchTags = async () => {
  try {
    const res = await getTags();
    // 기본 태그(user_id 없음) + 내 태그(user_id === 나)만 표시
    tags.value = res.data.filter(
      (t) => !t.user_id || t.user_id === userInfo?.id,
    );
  } catch (e) {
    console.error('태그 불러오기 실패:', e);
  }
};

onMounted(() => {
  fetchTags();
});

watch(
  () => props.value,
  (val) => {
    if (val) selected.value = val;
  },
  { immediate: true },
);

// type 바뀌면 선택된 태그 초기화
watch(
  () => props.type,
  () => {
    selected.value = {};
    emit('submit-tag', {});
  },
);

const handleSelect = (tag) => {
  selected.value = tag;
  emit('submit-tag', tag);
};
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
  min-width: 60px;
}
.tag-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.tag-btn {
  padding: 6px 16px;
  border: 1px solid #ebebeb;
  border-radius: 20px;
  background-color: #ffffff;
  color: #9e9e9e;
  font-size: 0.85rem;
  cursor: pointer;
}
.tag-btn.active {
  background-color: #fcf2d0;
  color: #545045;
  border-color: #ffbc00;
}
.empty-tag {
  font-size: 0.85rem;
  color: #c0c0c0;
}
.add-tag-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px dashed #ffbc00;
  background: #fff;
  color: #ffbc00;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  flex-shrink: 0;
}
.add-tag-btn:hover {
  background: #fff9e6;
}
</style>
