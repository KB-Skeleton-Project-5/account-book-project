import api from "./index.js";

// 지출 목록 조회
// export const getExList = () => {
//      return api.get('/expenses')
//   }
//

// 지출 상세 조회 (READ)
export const getExpense = (id) => {
    return api.get(`/expenses/${id}`)
};

// 지출 추가 (CREATE)
export const createExpense = (data) => {
    return api.post('/expenses', data)
};

// 지출 수정 (UPDATE)
export const updateExpenses = (id, data) => {
    return api.put(`/expenses/${id}`, data)
};

// 지출 삭제 (DELETE)
export const deleteExpenses = (id) => {
    return api.delete(`/expenses/${id}`)
}