<template>
  <div class="wrapper">
    <AppHeader title="비밀번호 재설정" :back="true" backTo="users/login" />

    <div class="form-area">
      <div class="field">
        <label>아이디</label>
        <input
          type="text"
          v-model="form.login_id"
          placeholder="아이디를 입력하세요"
        />
      </div>
      <div class="field">
        <label>새 비밀번호</label>
        <input
          type="password"
          v-model="form.newPw"
          placeholder="새 비밀번호를 입력하세요"
        />
      </div>
      <div class="field">
        <label>새 비밀번호 확인</label>
        <input
          type="password"
          v-model="newPwConfirm"
          placeholder="새 비밀번호를 다시 입력하세요"
        />
      </div>
    </div>

    <div class="btn-area">
      <!-- TODO: AppButton 컴포넌트로 교체 예정 -->
      <AppButton text="저장" @click="handleReset" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { updateUserProcess } from '@/util/authUtil';
import AppButton from '@/components/commons/AppButton.vue';
import AppHeader from '@/layouts/AppHeader.vue';

const router = useRouter();

const form = reactive({
  login_id: '',
  newPw: '',
});

const newPwConfirm = ref('');

async function handleReset() {
  //아이디 유효성 검사
  if (!form.login_id.trim()) {
    alert('아이디를 입력하세요');
    return;
  }
  //비밀번호 유효성 검사
  if (!form.newPw.trim()) {
    alert('새 비밀번호를 입력하세요');
    return;
  }
  if (form.newPw !== newPwConfirm.value) {
    alert('비밀번호가 일치하지 않습니다');
    return;
  }
  const response = await fetch(`/api/users/?login_id=${form.login_id}`);
  const users = await response.json();

  if (users.length === 0) {
    alert('존재하지 않는 아이디입니다');
    return;
  }

  const user = users[0];

  updateUserProcess(
    user.id,
    { pw: form.newPw },
    () => {
      alert('비밀번호가 변경되었습니다');
      router.push({ name: 'users/login' });
    },
    () => {
      alert('비밀번호변경에 실패했습니다');
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
}
.form-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
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
.btn-area {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}
.app-btn {
  padding: 8px 24px;
  background-color: #fff;
  color: #545045;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.app-btn:hover {
  background-color: #f9f9f9;
}
</style>
