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
      
      <app-button text="저장" @click="handleSignup" @keyup.enter="handleSignup"/>
    </div> 

  </div>
</template>

<script setup>
import AppButton from '@/components/commons/AppButton.vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/layouts/AppHeader.vue'
import { registerProcess } from '@/util/authUtil'



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
    alert('비밀번호가 일치하지 않습니다')
    console.log('비밀번호가 일치하지 않습니다')
    return
  }
  registerProcess(
    form,
    () => {
      console.log('회원가입 성공')
      router.push({name:"users/login"})
    },
    () => {
      alert('회원가입에 실패했습니다')
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
