<template>
  <div class="wrapper">

    <AppHeader title="회원수정" :back="true" backTo="users/info" />

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
        <input type="text" :value="form.loginid" disabled class="input-disabled" />
      </div>
      <div class="field">
        <label>
          새 비밀번호
          <button class="btn-pw-toggle" type="button" @click="pwEnabled = !pwEnabled">
            {{ pwEnabled ? '취소' : '변경하기' }}
          </button>
        </label>
        <input
          type="password"
          v-model="form.newPw"
          placeholder="변경할 비밀번호를 입력하세요"
          :disabled="!pwEnabled"
          :class="{ 'input-disabled': !pwEnabled }"
        />
      </div>
      <div class="field">
        <label>비밀번호 확인</label>
        <input
          type="password"
          v-model="pwConfirm"
          placeholder="비밀번호를 다시 입력하세요"
          :disabled="!pwEnabled"
          :class="{ 'input-disabled': !pwEnabled }"
        />
      </div>
    </div>

    <div class="btn-area">
      <AppButton text="저장" @click="handleSave" />
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
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo, fetchUserById, updateUserProcess } from '@/util/authUtil.js'
import AppButton from '@/components/commons/AppButton.vue'
import AppHeader from '@/layouts/AppHeader.vue'
import AlertModal from '@/components/commons/AlertModal.vue'  // 추가

const router = useRouter()

const form = reactive({
  name: '',
  nick: '',
  email: '',
  loginid: '',
  newPw: ''
})

const pwConfirm = ref('')
const pwEnabled = ref(false)
const originalData = ref({})

// 모달 상태 변수 추가
const modal = reactive({
  show: false,
  title: '',
  message: '',
  isSuccess: false  // 수정 성공 여부 체크용
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
  // 수정 성공한 경우에만 페이지 이동
  if (modal.isSuccess) {
    router.push({ name: 'users/info' })
  }
}

onMounted(async () => {
  const userInfo = getUserInfo()

  if (!userInfo.authenticated) {
    router.push({ name: 'users/login' })
    return
  }
  const user = await fetchUserById(userInfo.id)
  if (user) {
    form.name = user.name
    form.nick = user.nick
    form.email = user.email
    form.loginid = user.loginid

    originalData.value = {
      name: user.name,
      nick: user.nick,
      email: user.email
    }
  }
})

async function handleSave() {
  if (!form.name.trim()) {
    showAlert('입력 확인', '이름을 입력하세요')
    return
  }
  const nameRegex = /^[가-힣a-zA-Z]+$/
  if (!nameRegex.test(form.name)) {
    showAlert('입력 확인', '이름은 한글 또는 영문만 입력 가능합니다')
    return
  }
  if (!form.nick.trim()) {
    showAlert('입력 확인', '닉네임을 입력하세요')
    return
  }
  if (!form.email.trim()) {
    showAlert('입력 확인', '이메일을 입력하세요')
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    showAlert('입력 확인', '올바른 이메일 형식이 아닙니다')
    return
  }
  if (!form.newPw && pwConfirm.value) {
    showAlert('입력 확인', '새 비밀번호를 입력하세요')
    return
  }
  if (form.newPw && form.newPw !== pwConfirm.value) {
    showAlert('입력 확인', '비밀번호가 일치하지 않습니다')
    return
  }
  if (
    form.name === originalData.value.name &&
    form.nick === originalData.value.nick &&
    form.email === originalData.value.email &&
    !form.newPw
  ) {
    showAlert('알림', '이미 회원정보와 동일합니다')
    return
  }

  const userInfo = getUserInfo()

  const updateData = {
    name: form.name,
    nick: form.nick,
    email: form.email,
  }

  if (form.newPw) {
    updateData.pw = form.newPw
  }

  updateUserProcess(
    userInfo.id,
    updateData,
    () => {
      console.log('수정 성공')
      showAlert('수정 완료', '수정이 완료되었습니다', true)  // isSuccess = true
    },
    () => {
      showAlert('수정 실패', '수정에 실패했습니다')
    }
  )
}
</script>

<style scoped>
.btn-pw-toggle {
  margin-left: 8px;
  padding: 2px 10px;
  font-size: 0.75rem;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  color: #545045;
}
</style>
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
