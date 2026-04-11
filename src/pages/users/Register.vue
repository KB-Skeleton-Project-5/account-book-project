<template>
  <div class="wrapper">

    <AppHeader title="회원가입" :back="true" backTo="users/login" />

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
        <input type="text" v-model="form.loginid" placeholder="아이디를 입력하세요" />
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
      <app-button text="저장" @click="handleSignup" @keyup.enter="handleSignup"/>
    </div>

    <!-- AlertModal 추가 -->
    <AlertModal
      v-if="modal.show"
      :title="modal.title"
      :message="modal.message"
      @confirm="handleModalConfirm"
    />

  </div>
</template>

<script setup>
import AppButton from '@/components/commons/AppButton.vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/layouts/AppHeader.vue'
import { registerProcess } from '@/util/authUtil'
import AlertModal from '@/components/commons/AlertModal.vue'  // 추가

const router = useRouter()

const form = reactive({
  name: '',
  nick: '',
  email: '',
  loginid: '',
  pw: ''
})

const pwConfirm = ref('')

// 모달 상태 변수 추가
const modal = reactive({
  show: false,
  title: '',
  message: '',
  isSuccess: false
})

// showAlert 함수 추가
function showAlert(title, message, isSuccess = false) {
  modal.title = title
  modal.message = message
  modal.isSuccess = isSuccess
  modal.show = true
}

// 확인 버튼 클릭 시
function handleModalConfirm() {
  modal.show = false
  if (modal.isSuccess) {
    router.push({ name: 'users/login' })
  }
}

async function handleSignup() {
  if (!form.name.trim()) {
    showAlert('입력 확인', '이름을 입력하세요')
    console.log('이름을 입력하세요')
    return
  }
  const nameRegex = /^[가-힣a-zA-Z]+$/
  if (!nameRegex.test(form.name)) {
    showAlert('입력 확인', '이름은 한글 또는 영문만 입력 가능합니다')
    console.log('이름은 한글 또는 영문만 입력 가능합니다')
    return
  }
  if (!form.nick.trim()) {
    showAlert('입력 확인', '닉네임을 입력하세요')
    console.log('닉네임을 입력하세요')
    return
  }
  if (!form.email.trim()) {
    showAlert('입력 확인', '이메일을 입력하세요')
    console.log('이메일을 입력하세요')
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    showAlert('입력 확인', '올바른 이메일 형식이 아닙니다')
    console.log('올바른 이메일 형식이 아닙니다')
    return
  }
  if (!form.loginid.trim()) {
    showAlert('입력 확인', '아이디를 입력하세요')
    console.log('아이디를 입력하세요')
    return
  }

  // 아이디 중복 체크
  const checkRes = await fetch(`/api/users?loginid=${form.loginid}`)
  const checkUsers = await checkRes.json()
  if (checkUsers.length > 0) {
    showAlert('중복 확인', '이미 사용 중인 아이디입니다')
    return
  }

  if (!form.pw.trim()) {
    showAlert('입력 확인', '비밀번호를 입력하세요')
    console.log('비밀번호를 입력하세요')
    return
  }
  if (form.pw !== pwConfirm.value) {
    showAlert('입력 확인', '비밀번호가 일치하지 않습니다')
    console.log('비밀번호가 일치하지 않습니다')
    return
  }

  const newForm = {
    ...form,
    id: Math.random().toString(36).substring(2, 9)
  }

  registerProcess(
    newForm,
    () => {
      console.log('회원가입 성공')
      showAlert('가입 완료', '회원가입이 완료되었습니다', true)  // isSuccess = true
    },
    () => {
      showAlert('가입 실패', '회원가입에 실패했습니다')
    }
  )
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
