<template>
  <div class="wrapper">
    <AppHeader title="비밀번호 재설정" :back="true" backTo="users/login" />

    <div class="form-area">
      <div class="field">
        <label>아이디</label>
        <input type="text" v-model="form.loginid" placeholder="아이디를 입력하세요" />
      </div>
      <div class="field">
        <label>새 비밀번호</label>
        <input type="password" v-model="form.newPw" placeholder="새 비밀번호를 입력하세요" />
      </div>
      <div class="field">
        <label>새 비밀번호 확인</label>
        <input type="password" v-model="newPwConfirm" placeholder="새 비밀번호를 다시 입력하세요" />
      </div>
    </div>

    <div class="btn-area">
      <AppButton text="저장" @click="handleReset" />
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { updateUserProcess } from '@/util/authUtil'
import AppButton from '@/components/commons/AppButton.vue'
import AppHeader from '@/layouts/AppHeader.vue'
import AlertModal from '@/components/commons/AlertModal.vue'  // 추가

const router = useRouter()

const form = reactive({
  loginid: '',
  newPw: ''
})

const newPwConfirm = ref('')

// 모달 상태 변수 추가
const modal = reactive({
  show: false,
  title: '',
  message: '',
  isSuccess: false  // 성공 여부 체크용
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
  // 비밀번호 변경 성공한 경우에만 로그인 페이지로 이동
  if (modal.isSuccess) {
    router.push({ name: 'users/login' })
  }
}

async function handleReset() {
  if (!form.loginid.trim()) {
    showAlert('입력 확인', '아이디를 입력하세요')
    return
  }
  if (!form.newPw.trim()) {
    showAlert('입력 확인', '새 비밀번호를 입력하세요')
    return
  }
  if (form.newPw !== newPwConfirm.value) {
    showAlert('입력 확인', '비밀번호가 일치하지 않습니다')
    return
  }

  const response = await fetch(`/api/users?loginid=${form.loginid}`)
  const users = await response.json()

  if (users.length === 0) {
    showAlert('확인 실패', '존재하지 않는 아이디입니다')
    return
  }

  const user = users[0]

  if (user.pw === form.newPw) {
    showAlert('알림', '이미 동일한 비밀번호입니다')
    return
  }

  updateUserProcess(
    user.id,
    { pw: form.newPw },
    () => {
      showAlert('변경 완료', '비밀번호가 변경되었습니다', true)  // isSuccess = true
    },
    () => {
      showAlert('변경 실패', '비밀번호 변경에 실패했습니다')
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
