<template>
  <div class="wrapper">

    <div class="page-header">
      <button class="btn-back" @click="router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <h2 class="page-title">회원가입</h2>
    </div>

    <div class="form-area">
      <div class="field">
        <label>이름</label>
        <input type="text" v-model="form.name" placeholder="이름을 입력하세요" />
      </div>
      <div class="field">
        <label>닉네임</label>
        <input type="text" v-model="form.nick" placeholder="닉네임을 입력하세요" />
      </div>
      <div class="field">
        <label>이메일</label>
        <input type="email" v-model="form.email" placeholder="이메일을 입력하세요" />
      </div>
      <div class="field">
        <label>아이디</label>
        <input type="text" v-model="form.userId" placeholder="아이디를 입력하세요" />
      </div>
      <div class="field">
        <label>비밀번호</label>
        <input type="password" v-model="form.pw" placeholder="비밀번호를 입력하세요" />
      </div>
      <div class="field">
        <label>비밀번호 확인</label>
        <input type="password" v-model="pwConfirm" placeholder="비밀번호를 다시 입력하세요" />
      </div>
    </div>

    <div class="btn-area">
      <!-- TODO: AppButton 컴포넌트로 교체 예정 -->
      <button class="app-btn" @click="handleSignup">저장</button>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  name: '',
  nick: '',
  email: '',
  userId: '',
  pw: ''
})

const pwConfirm = ref('')

function handleSignup() {
  if (form.pw !== pwConfirm.value) {
    console.log('비밀번호가 일치하지 않습니다')
    return
  }
  // TODO: 서버 회원가입 요청 연결
  console.log('회원가입 시도:', form)
}
</script>

<style scoped>
.wrapper {
  min-height: 100dvh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 28px 32px;
  max-width: 400px;
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
