import axios from 'axios'

const USERS_URI = '/api/users'

const setUserInfo = (userInfo) => {
  if (userInfo && userInfo.authenticated) {
    window.localStorage.setItem('userInfo', btoa(JSON.stringify(userInfo)))
  } else {
    window.localStorage.removeItem('userInfo')
  }
}

const getUserInfo = () => {
  const str = window.localStorage.getItem('userInfo')
  if (!str) return { authenticated: false }
  return JSON.parse(window.atob(str))
}

const loginProcess = async (loginid, pw, successCallback, failCallback) => {
  try {
    const response = await axios.get(USERS_URI, {
      params: {
        loginid: loginid.trim(),  // userId → loginid
        pw: pw.trim()
      }
    })

    if (response.data.length > 0) {
      const user = response.data[0]

      setUserInfo({
        authenticated: true,
        id: String(user.id),
        loginid: user.loginid,  // userId → loginid
      })

      successCallback()
    } else {
      if (failCallback) failCallback()
    }
  } catch (error) {
    alert('로그인 중 오류가 발생했습니다: ' + error)
  }
}

const logoutProcess = (callback) => {
  setUserInfo(null)
  callback()
}

const fetchUserById = async (id) => {
  try {
    const response = await axios.get(`${USERS_URI}/${id}`)
    return response.data
  } catch {
    return null
  }
}

const registerProcess = async (form, successCallback, failCallback) => {
  try {
    await axios.post(USERS_URI, form)
    successCallback()
  } catch (error) {
    if (failCallback) failCallback()
    alert('회원가입 중 오류가 발생했습니다: ' + error)
  }
}

const updateUserProcess = async (id, form, successCallback, failCallback) => {
  try {
    await axios.patch(`${USERS_URI}/${id}`, form)
    successCallback()
  } catch (error) {
    if (failCallback) failCallback()
    alert('회원정보 수정 중 오류가 발생했습니다: ' + error)
  }
}

const deleteUserProcess = async (id, loginid, successCallback, failCallback) => {
  try {
    // 1. 유저 삭제
    await axios.delete(`${USERS_URI}/${id}`)

    // 2. 관련 데이터 직접 삭제 (loginid 기준)
    const expenseRes = await axios.get(`/api/expenses?userId=${loginid}`)
    for (const item of expenseRes.data) {
      await axios.delete(`/api/expenses/${item.id}`)
    }

    const calendarRes = await axios.get(`/api/calendars?userId=${loginid}`)
    for (const item of calendarRes.data) {
      await axios.delete(`/api/calendars/${item.id}`)
    }

    const summaryRes = await axios.get(`/api/summaries?userId=${loginid}`)
    for (const item of summaryRes.data) {
      await axios.delete(`/api/summaries/${item.id}`)
    }

    const challengeRes = await axios.get(`/api/challenges?userId=${loginid}`)
    for (const item of challengeRes.data) {
      await axios.delete(`/api/challenges/${item.id}`)
    }

    successCallback()
  } catch (error) {
    if (failCallback) failCallback()
    alert('회원탈퇴 중 오류가 발생했습니다: ' + error)
  }
}

export {
  getUserInfo,
  loginProcess,
  logoutProcess,
  fetchUserById,
  registerProcess,
  updateUserProcess,
  deleteUserProcess,
}