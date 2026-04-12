<template>
  <div class="wrapper">
    <AppHeader title="내 정보" :back="true" backTo="main" />

    <!-- <div class="profile-area">
      <div class="avatar">{{ member.name ? member.name[0] : '' }}</div>
    </div> -->
    <div class="profile-area">
  <img :src="randomProfile" class="avatar-img" alt="프로필" />
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
        <input type="text" :value="member.login_id" readonly />  <!-- user_id → login_id -->
      </div>
    </div>

    <div class="btn-area">
      <AppButton text="수정" @click="router.push({ name: 'users/edit' })" />
    </div>

    <div class="bottom-btns">
      <button class="btn-logout" @click="handleLogout">로그아웃</button>
      <button class="btn-withdraw" @click="router.push({ name: 'users/delete' })">회원탈퇴</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted,ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo, fetchUserById, logoutProcess } from '@/util/authUtil'
import AppButton from '@/components/commons/AppButton.vue'
import AppHeader from '@/layouts/AppHeader.vue'
import profile1 from '@/assets/profiles/profile1.png'
import profile2 from '@/assets/profiles/profile2.png'
import profile3 from '@/assets/profiles/profile3.png'
import profile4 from '@/assets/profiles/profile4.png'
import profile5 from '@/assets/profiles/profile5.png'

const profiles = [profile1, profile2, profile3, profile4, profile5]

// localStorage에 저장된 프로필 인덱스 확인
const savedIndex = localStorage.getItem('profileIndex')
let profileIndex

if (savedIndex !== null) {
  profileIndex = parseInt(savedIndex)  // 저장된 거 사용
} else {
  profileIndex = Math.floor(Math.random() * profiles.length)  // 새로 뽑기
  localStorage.setItem('profileIndex', profileIndex)  // 저장
}

const randomProfile = ref(profiles[profileIndex])

const router = useRouter()

const member = reactive({
  login_id: '',  // user_id → login_id
  name: '',
  nick: '',
  email: '',
  profileImage: ''
})

onMounted(async () => {
  const userInfo = getUserInfo()

  if (!userInfo.authenticated) {
    router.push({ name: 'users/login' })
    return
  }
  const user = await fetchUserById(userInfo.id)
  if (user) {
    Object.assign(member, user)
  }
})

function handleLogout() {
  console.log('로그아웃')
  logoutProcess(() => {
    router.push({ name: 'users/login' })
  })
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
.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
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