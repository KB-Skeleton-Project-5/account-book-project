<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box">
      <!-- 헤더 -->
      <div class="modal-header">
        <h3 class="modal-title">🏷️ 태그 관리</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- 태그 생성 폼 -->
      <div class="create-section">
        <!-- 수입/지출 선택 -->
        <div class="type-row">
          <button
            class="type-btn"
            :class="{ active: selectedType === '수입' }"
            @click="selectedType = '수입'"
          >
            수입
          </button>
          <button
            class="type-btn"
            :class="{ active: selectedType === '지출' }"
            @click="selectedType = '지출'"
          >
            지출
          </button>
        </div>

        <div class="input-row">
          <input
            class="tag-input"
            type="text"
            placeholder="태그명 입력"
            v-model="newTagTitle"
            maxlength="10"
            @keyup.enter="handleCreate"
          />
          <button
            class="add-btn"
            @click="handleCreate"
            :disabled="!newTagTitle.trim()"
          >
            추가
          </button>
        </div>

        <!-- 색상 선택 -->
        <div class="color-row">
          <button
            v-for="preset in colorPresets"
            :key="preset.color"
            class="color-dot"
            :style="{
              backgroundColor: preset.color,
              outline:
                selectedPreset?.color === preset.color
                  ? '2px solid #545045'
                  : 'none',
            }"
            @click="selectedPreset = preset"
          />
        </div>

        <!-- 미리보기 -->
        <div class="preview-row" v-if="newTagTitle">
          <span class="preview-label">미리보기</span>
          <span
            class="tag-badge"
            :style="{
              backgroundColor: selectedPreset.color,
              color: selectedPreset.textColor,
            }"
          >
            {{ newTagTitle }}
          </span>
          <span class="type-label">{{ selectedType }}</span>
        </div>
      </div>

      <div class="divider" />

      <!-- 지출 태그 목록 -->
      <div v-if="selectedType === '지출'">
        <p class="list-title">지출 태그</p>
        <div class="tag-list">
          <p v-if="expenseTags.length === 0" class="empty-text">
            등록된 태그가 없습니다
          </p>
          <div v-for="tag in expenseTags" :key="tag.id" class="tag-item">
            <span
              class="tag-badge"
              :style="{ backgroundColor: tag.color, color: tag.textColor }"
            >
              {{ tag.tagtitle }}
            </span>
            <button class="delete-btn" @click="confirmDelete(tag)">삭제</button>
          </div>
        </div>
      </div>

      <!-- 수입 태그 목록 -->
      <div v-if="selectedType === '수입'">
        <p class="list-title">수입 태그</p>
        <div class="tag-list">
          <p v-if="incomeTags.length === 0" class="empty-text">
            등록된 태그가 없습니다
          </p>
          <div v-for="tag in incomeTags" :key="tag.id" class="tag-item">
            <span
              class="tag-badge"
              :style="{ backgroundColor: tag.color, color: tag.textColor }"
            >
              {{ tag.tagtitle }}
            </span>
            <button class="delete-btn" @click="confirmDelete(tag)">삭제</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 삭제 확인 모달 -->
  <DeleteConfirm
    v-if="showDeleteConfirm"
    :title="`'${targetTag?.tagtitle}' 삭제`"
    message="삭제하면 되돌릴 수 없어요."
    leftText="취소"
    rightText="삭제"
    @left="showDeleteConfirm = false"
    @right="handleDelete"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DeleteConfirm from '@/components/commons/DeleteConfirm.vue';
import { getTags, createTag, deleteTag } from '@/api/tags';
import { getUserInfo } from '@/util/authUtil';

const emit = defineEmits(['close', 'updated']);
const userInfo = getUserInfo();

const props = defineProps({
  initialType: {
    type: String,
    default: '지출',
  },
});

const tags = ref([]);
const newTagTitle = ref('');
const showDeleteConfirm = ref(false);
const targetTag = ref(null);
const selectedType = ref(props.initialType);

const expenseTags = computed(() => tags.value.filter((t) => t.type === '지출'));
const incomeTags = computed(() => tags.value.filter((t) => t.type === '수입'));

const colorPresets = [
  { color: '#FFD6D6', textColor: '#E57373' },
  { color: '#D6EAFF', textColor: '#5B9BD5' },
  { color: '#D6F0E0', textColor: '#66A882' },
  { color: '#FFF3C4', textColor: '#B8860B' },
  { color: '#E8D6FF', textColor: '#9B59B6' },
  { color: '#FFE5D6', textColor: '#E67E22' },
  { color: '#D6F0F0', textColor: '#17A589' },
  { color: '#BDBDBD', textColor: '#424242' },
];
const selectedPreset = ref(colorPresets[0]);

const fetchTags = async () => {
  try {
    const res = await getTags();
    tags.value = res.data;
  } catch (e) {
    console.error('태그 불러오기 실패:', e);
  }
};

const handleCreate = async () => {
  const title = newTagTitle.value.trim();
  if (!title) return;

  if (tags.value.some((t) => t.tagtitle === title)) {
    alert('이미 존재하는 태그명입니다.');
    return;
  }

  try {
    await createTag({
      tagid: title.replace(/\s+/g, '_') + '_' + Date.now(),
      tagtitle: title,
      color: selectedPreset.value.color,
      textColor: selectedPreset.value.textColor,
      type: selectedType.value,
      user_id: userInfo?.id,
    });
    newTagTitle.value = '';
    selectedPreset.value = colorPresets[0];
    await fetchTags();
    emit('updated');
  } catch (e) {
    console.error('태그 생성 실패:', e);
  }
};

const confirmDelete = (tag) => {
  targetTag.value = tag;
  showDeleteConfirm.value = true;
};

const handleDelete = async () => {
  try {
    await deleteTag(targetTag.value.id);
    showDeleteConfirm.value = false;
    targetTag.value = null;
    await fetchTags();
    emit('updated');
  } catch (e) {
    console.error('태그 삭제 실패:', e);
  }
};

onMounted(() => {
  fetchTags();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-box {
  background: #fff;
  border-radius: 16px;
  width: 320px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: #545045;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1rem;
  color: #9e9e9e;
  cursor: pointer;
  padding: 0;
}
.create-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.type-row {
  display: flex;
  gap: 8px;
}
.type-btn {
  flex: 1;
  padding: 6px 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  color: #9e9e9e;
  font-size: 0.85rem;
  cursor: pointer;
}
.type-btn.active {
  background: #ffcc00;
  border-color: #ffcc00;
  color: #545045;
  font-weight: 700;
}
.input-row {
  display: flex;
  gap: 8px;
}
.tag-input {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  outline: none;
}
.tag-input:focus {
  border-color: #ffcc00;
}
.add-btn {
  background: #ffcc00;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #545045;
  cursor: pointer;
}
.add-btn:disabled {
  background: #f0f0f0;
  color: #b0b0b0;
  cursor: not-allowed;
}
.color-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  outline-offset: 3px;
}
.preview-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.preview-label {
  font-size: 0.8rem;
  color: #9e9e9e;
}
.type-label {
  font-size: 0.75rem;
  color: #9e9e9e;
  margin-left: auto;
}
.divider {
  border-top: 1px solid #ebebeb;
}
.list-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #545045;
  margin-bottom: 8px;
}
.tag-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tag-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tag-badge {
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}
.delete-btn {
  background: none;
  border: 1px solid #e57373;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 0.78rem;
  color: #e57373;
  cursor: pointer;
}
.delete-btn:hover {
  background: #ffe5e5;
}
.empty-text {
  font-size: 0.85rem;
  color: #c0c0c0;
  text-align: center;
  padding: 12px 0;
}
</style>
