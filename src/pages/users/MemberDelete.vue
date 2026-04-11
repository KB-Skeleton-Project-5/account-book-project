<template>
  <div class="wrapper">
    <AppHeader title="회원탈퇴" :back="true" backTo="users/info" />

    <div class="warn-box">
      탈퇴 시 모든 데이터(지출, 캘린더, 챌린지)가 영구 삭제됩니다.<br />
      삭제된 데이터는 복구할 수 없습니다.
    </div>

    <div class="form-area">
      <div class="field">
        <label>아이디 확인</label>
        <input
          type="text"
          v-model="form.login_id"
          placeholder="아이디를 입력하세요"
        />
      </div>
      <div class="field">
        <label>비밀번호 확인</label>
        <input
          type="password"
          v-model="form.pw"
          placeholder="비밀번호를 입력하세요"
        />
      </div>
    </div>

    <div class="agree-row">
      <input
        type="checkbox"
        id="agree-check"
        v-model="isAgreed"
        @change="onAgreeChange"
      />
      <label for="agree-check"
        >위 내용을 모두 확인했으며 탈퇴에 동의합니다</label
      >
    </div>

    <!-- 모달 후에 교체 예정 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="delete-modal">
        <p class="modal-title">정말 탈퇴하시겠습니까?</p>
        <p class="modal-sub">
          탈퇴 후 모든 데이터가 삭제되며<br />되돌릴 수 없습니다
        </p>
        <div class="modal-btns">
          <button class="modal-cancel" @click="closeModal">취소</button>
          <button class="modal-confirm" @click="handleDelete">탈퇴하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { deleteUserProcess, logoutProcess } from '@/util/authUtil';
import AppHeader from '@/layouts/AppHeader.vue';

const router = useRouter();

const form = reactive({
  login_id: '',
  pw: '',
});

const isAgreed = ref(false);
const showModal = ref(false);

function onAgreeChange() {
  if (isAgreed.value) {
    showModal.value = true;
  }
}

function closeModal() {
  showModal.value = false;
  isAgreed.value = false;
}

async function handleDelete() {
  // 유효성 검사
  if (!form.login_id.trim()) {
    alert('아이디를 입력하세요');
    console.log('아이디를 입력하세요');
    return;
  }
  if (!form.pw.trim()) {
    alert('비밀번호를 입력하세요');
    console.log('비밀번호를 입력하세요');
    return;
  }
  // 입력한 아이디/비밀번호로 본인 확인
  const response = await fetch(
    `/api/users?login_id=${form.login_id}&pw=${form.pw}`,
  );
  const users = await response.json();

  if (users.length === 0) {
    alert('아이디 또는 비밀번호가 틀렸습니다');
    console.log('아이디 또는 비밀번호가 틀렸습니다');
    closeModal();
    return;
  }

  const user = users[0];

  deleteUserProcess(
    user.id,
    () => {
      logoutProcess(() => {
        router.push({ name: 'users/login' });
      });
    },
    () => {
      alert('탈퇴에 실패했습니다');
      console.log('탈퇴에 실패했습니다');
      closeModal();
    },
  );
}
</script>

<style scoped>
.wrapper {
  min-height: 100dvh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 28px 32px;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
}

.warn-box {
  background-color: #fff5f5;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 0.85rem;
  color: #e57373;
  line-height: 1.6;
  margin-bottom: 24px;
}
.form-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field label {
  display: block;
  font-size: 0.8rem;
  color: #545045;
  font-weight: 500;
  margin-bottom: 6px;
}
.field input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #333;
  outline: none;
  transition: border-color 0.15s;
}
.field input:focus {
  border-color: #ffbc00;
}
.agree-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  padding: 14px 16px;
  background-color: #fff5f5;
  border: 1px solid #ffcccc;
  border-radius: 8px;
}
.agree-row input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #e57373;
  flex-shrink: 0;
}
.agree-row label {
  font-size: 0.82rem;
  color: #e57373;
  cursor: pointer;
  line-height: 1.4;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #fff;
  border-radius: 12px;
  padding: 28px 24px;
  width: 80%;
  max-width: 320px;
}
.modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: #545045;
  text-align: center;
  margin-bottom: 8px;
}
.modal-sub {
  font-size: 0.85rem;
  color: #9e9e9e;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 20px;
}
.modal-btns {
  display: flex;
  gap: 10px;
}
.modal-cancel {
  flex: 1;
  height: 42px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #9e9e9e;
  cursor: pointer;
  transition: background 0.15s;
}
.modal-cancel:hover {
  background-color: #f9f9f9;
}
.modal-confirm {
  flex: 1;
  height: 42px;
  background: #fff;
  border: 1px solid #e57373;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #e57373;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.modal-confirm:hover {
  background-color: #fff5f5;
}
</style>
