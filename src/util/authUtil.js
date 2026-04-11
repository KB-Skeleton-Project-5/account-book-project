// 로그인 / 로그아웃 / 세션 / 유저 정보 유틸 함수 모음
import axios from 'axios';

const USERS_URI = '/api/users';

// ==============================
// 1. 로그인 세션 저장 (localStorage)
// ==============================
const setUserInfo = (userInfo) => {
  if (userInfo && userInfo.authenticated) {
    window.localStorage.setItem('userInfo', btoa(JSON.stringify(userInfo)));
  } else {
    window.localStorage.removeItem('userInfo');
  }
};

// ==============================
// 2. 로그인 세션 조회
// ==============================
const getUserInfo = () => {
  const str = window.localStorage.getItem('userInfo');
  if (!str) return { authenticated: false };
  return JSON.parse(window.atob(str));
};

// ==============================
// 3. 로그인 처리
// ==============================
const loginProcess = async (user_id, pw, successCallback, failCallback) => {
  try {
    const response = await axios.get(USERS_URI, {
      params: {
        user_id: user_id.trim(),
        pw: pw.trim(),
      },
    });

    if (response.data.length > 0) {
      const user = response.data[0];

      setUserInfo({
        authenticated: true,
        id: user.id,
        user_id: user.user_id,
      });

      successCallback();
    } else {
      if (failCallback) failCallback();
    }
  } catch (error) {
    alert('로그인 중 오류가 발생했습니다: ' + error);
  }
};

// ==============================
// 4. 로그아웃 처리
// ==============================
const logoutProcess = (callback) => {
  setUserInfo(null);
  callback();
};

// ==============================
// 5. 사용자 정보 조회
// ==============================
const fetchUserById = async (id) => {
  try {
    const response = await axios.get(`${USERS_URI}/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

// ==============================
// 6. 회원가입
// ==============================
const registerProcess = async (form, successCallback, failCallback) => {
  try {
    await axios.post(USERS_URI, form);
    successCallback();
  } catch (error) {
    if (failCallback) failCallback();
    alert('회원가입 중 오류가 발생했습니다: ' + error);
  }
};

// ==============================
// 7. 회원정보 수정
// ==============================
const updateUserProcess = async (id, form, successCallback, failCallback) => {
  try {
    await axios.patch(`${USERS_URI}/${id}`, form);
    successCallback();
  } catch (error) {
    if (failCallback) failCallback();
    alert('회원정보 수정 중 오류가 발생했습니다: ' + error);
  }
};

// ==============================
// 8. 회원탈퇴
// ==============================
const deleteUserProcess = async (id, successCallback, failCallback) => {
  try {
    await axios.delete(`${USERS_URI}/${id}`);
    successCallback();
  } catch (error) {
    if (failCallback) failCallback();
    alert('회원탈퇴 중 오류가 발생했습니다: ' + error);
  }
};
// const deleteUserProcess = async (id, successCallback, failCallback) => {
//   try {
//     // 1. 유저 삭제
//     await axios.delete(`${USERS_URI}/${id}`)

//     // 2. 관련 데이터 직접 삭제
//     const expenseRes = await axios.get(`/api/expensesdb?user_id=${id}`)
//     for (const item of expenseRes.data) {
//       await axios.delete(`/api/expensesdb/${item.id}`)
//     }

//     const calendarRes = await axios.get(`/api/calendarsdb?user_id=${id}`)
//     for (const item of calendarRes.data) {
//       await axios.delete(`/api/calendarsdb/${item.id}`)
//     }

//     const summaryRes = await axios.get(`/api/summarydb?user_id=${id}`)
//     for (const item of summaryRes.data) {
//       await axios.delete(`/api/summarydb/${item.id}`)
//     }

//     const challengeRes = await axios.get(`/api/challengesdb?user_id=${id}`)
//     for (const item of challengeRes.data) {
//       await axios.delete(`/api/challengesdb/${item.id}`)
//     }

//     successCallback()
//   } catch (error) {
//     if (failCallback) failCallback()
//     alert('회원탈퇴 중 오류가 발생했습니다: ' + error)
//   }
// }

export {
  getUserInfo,
  loginProcess,
  logoutProcess,
  fetchUserById,
  registerProcess,
  updateUserProcess,
  deleteUserProcess,
};
