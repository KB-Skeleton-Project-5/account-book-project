import api from './index.js';

// 지출 목록 조회
export const getExpenses = () => api.get('/expenses');

// 지출 상세 조회
export const getExpense = (id) => api.get(`/expenses/${id}`);

// 지출 추가
export const createExpense = (data) => api.post('/expenses', data);

// 지출 수정
export const updateExpenses = (id, data) => api.put(`/expenses/${id}`, data);

// 지출 삭제
export const deleteExpenses = (id) => api.delete(`/expenses/${id}`);
