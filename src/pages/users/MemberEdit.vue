<template>
  <div class="wrapper">

    <div class="page-header">
      <button class="btn-back" @click="router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <h2 class="page-title">회원수정</h2>
    </div>

    <div class="form-area">
      <div class="field">
        <label>이름</label>
        <input type="text" v-model="form.name" />
      </div>
      <div class="field">
        <label>닉네임</label>
        <input type="text" v-model="form.nick" />
      </div>
      <div class="field">
        <label>이메일</label>
        <input type="email" v-model="form.email" />
      </div>
      <div class="field">
        <label>아이디 <span class="disabled-label">(수정불가)</span></label>
        <input type="text" :value="form.userId" disabled class="input-disabled" />
      </div>
      <div class="field">
        <label>새 비밀번호</label>
        <input type="password" v-model="form.newPw" placeholder="변경할 비밀번호를 입력하세요" />
      </div>
      <div class="field">
        <label>비밀번호 확인</label>
        <input type="password" v-model="pwConfirm" placeholder="비밀번호를 다시 입력하세요" />
      </div>
    </div>

    <div class="btn-area">
      <!-- TODO: AppButton 컴포넌트로 교체 예정 -->
      <button class="app-btn" @click="handleSave">저장</button>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// TODO: 서버에서 기존 데이터 불러오기
const form = reactive({
  name: '홍길동',
  nick: '길동이',
  email: 'hong@email.com',
  userId: 'user_001',
  newPw: ''
})

const pwConfirm = ref('')

function handleSave() {
  if (form.newPw && form.newPw !== pwConfirm.value) {
    console.log('비밀번호가 일치하지 않습니다')
    return
  }
  // TODO: 서버 수정 요청 연결
  console.log('수정 저장:', form)
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
.page-header {
  display: flex;
  align-items: center;
  padding: 20px 0 24px;
  position: relative;
}
.btn-back {
  background: none;
  border: none;
  cursor: pointer;
  color: #545045;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  transition: background 0.15s;
}
.btn-back:hover {
  background-color: #f0f0f0;
}
.page-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.05rem;
  font-weight: 700;
  color: #545045;
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
.disabled-label {
  font-size: 0.75rem;
  color: #aaa;
  font-weight: 400;
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
.input-disabled {
  background-color: #eeeeee;
  color: #aaa;
  cursor: not-allowed;
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
