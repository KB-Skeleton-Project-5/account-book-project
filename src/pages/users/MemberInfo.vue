<template>
  <div class="wrapper">

    <div class="page-header">
      <button class="btn-back" @click="router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <h2 class="page-title">내 정보</h2>
    </div>

    <div class="profile-area">
      <div class="avatar">{{ member.name[0] }}</div>
    </div>

    <div class="form-area">
      <div class="field">
        <label>이름</label>
        <input type="text" :value="member.name" readonly />
      </div>
      <div class="field">
        <label>닉네임</label>
        <input type="text" :value="member.nick" readonly />
      </div>
      <div class="field">
        <label>이메일</label>
        <input type="text" :value="member.email" readonly />
      </div>
      <div class="field">
        <label>아이디</label>
        <input type="text" :value="member.userId" readonly />
      </div>
    </div>

    <div class="btn-area">
      <!-- TODO: AppButton 컴포넌트로 교체 예정 -->
      <AppButton text="수정" @click="router.push({ name: 'users/edit' })" />
    </div>

    <div class="bottom-btns">
      <button class="btn-logout" @click="handleLogout">로그아웃</button>
      <button class="btn-withdraw" @click="router.push({ name: 'users/delete' })">회원탈퇴</button>
    </div>

  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/commons/AppButton.vue'

const router = useRouter()

// TODO: 서버에서 실제 데이터 불러오기
const member = reactive({
  userId: 'user_001',
  name: '홍길동',
  nick: '길동이',
  email: 'hong@email.com',
  profileImage: ''
})

function handleLogout() {
  // TODO: 로그인 상태 초기화 연결
  console.log('로그아웃')
  router.push({ name: 'users/login' })
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
  padding: 20px 0 16px;
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
.profile-area {
  display: flex;
  justify-content: center;
  padding: 8px 0 24px;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #fff3cc;
  color: #545045;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background-color: #fafafa;
  outline: none;
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
.bottom-btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}
.btn-logout {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 0.85rem;
  color: #545045;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-logout:hover {
  background-color: #f9f9f9;
}
.btn-withdraw {
  background: none;
  border: none;
  font-size: 0.75rem;
  color: #ccc;
  cursor: pointer;
  text-decoration: underline;
}
</style>