<template>
  <div class="login-wrapper">
    <div class="login-card">

      <h2 class="login-title">로그인</h2>
      <p class="login-sub">계정에 로그인하세요</p>

      <div class="field">
        <label>아이디</label>
        <input type="text" v-model="form.login_id" 
          placeholder="아이디를 입력하세요" 
          @keyup.enter="handleLogin" />
      </div>

      <div class="field">
        <label>비밀번호</label>
        <input type="password" v-model="form.pw" 
          placeholder="비밀번호를 입력하세요" 
          @keyup.enter="handleLogin"/>
      </div>

      <button class="btn-login" @click="handleLogin">로그인</button>

      <hr class="divider" />

      <p class="link-row">
        비밀번호를 잊으셨나요?
        <router-link to="/users/reset">비밀번호 재설정</router-link>
      </p>
      <p class="link-row">
        계정이 없으신가요?
        <router-link to="/users/register">회원가입</router-link>
      </p>
       
    </div>
  </div>
   <!-- ① 모달 컴포넌트 추가 - v-if로 show가 true일 때만 표시 -->
   <AlertModal v-if="modal.show" :title="modal.title"
          :message="modal.message" @confirm="modal.show = false"/>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { loginProcess } from '@/util/authUtil'
import AlertModal from '@/components/commons/AlertModal.vue' //AlertModal 추가
const router = useRouter()

const form = reactive({
  login_id: '',  // user_id → login_id
  pw: ''
})

// ③ 모달 상태 변수 추가
const modal = reactive({
  show: false,
  title: '',
  message: ''
})
// ④  대신 쓸 함수 추가
function showAlert(title, message) {
  modal.title = title
  modal.message = message
  modal.show = true
}

function handleLogin() {
  if (!form.login_id.trim()) {
    showAlert('로그인 실패','아이디를 입력하세요')
    console.log('아이디를 입력하세요')
    return
  }
  if (!form.pw.trim()) {
    showAlert('로그인 실패','비밀번호를 입력하세요')
    console.log('비밀번호를 입력하세요')
    return
  }
  loginProcess(
    form.login_id,  // user_id → login_id
    form.pw,
    () => {
      console.log('로그인 성공')
      router.push({ name: 'main' })
    },
    () => {
      showAlert('로그인 실패','아이디 또는 비밀번호가 틀렸습니다.')
    }
  )
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}
.login-card {
  width: 100%;
  max-width: 480px;
  min-height: 100dvh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 32px;
}
.login-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #545045;
  text-align: center;
  margin-bottom: 6px;
}
.login-sub {
  font-size: 0.85rem;
  color: #9e9e9e;
  text-align: center;
  margin-bottom: 32px;
}
.field {
  margin-bottom: 16px;
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
.btn-login {
  width: 100%;
  height: 46px;
  margin-top: 8px;
  background-color: #ffbc00;
  color: #545045;
  font-size: 0.95rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-login:hover {
  background-color: #f0b000;
}
.divider {
  border: none;
  border-top: 1px solid #ebebeb;
  margin: 24px 0;
}
.link-row {
  text-align: center;
  font-size: 0.8rem;
  color: #9e9e9e;
  margin-bottom: 8px;
}
.link-row a {
  color: #ffbc00;
  font-weight: 600;
  text-decoration: none;
}
</style>

