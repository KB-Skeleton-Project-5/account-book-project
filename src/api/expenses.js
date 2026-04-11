import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// 지출 목록 조회
export const getExpenses = (id) => api.get('/expensesdb', { params: id });

// 지출 상세 조회
export const getExpense = (id) => api.get(`/expensesdb/${id}`);

// 지출 추가
export const createExpense = (data) => api.post('/expensesdb', data);

// 지출 수정
export const updateExpenses = (id, data) => api.put(`/expensesdb/${id}`, data);

// 지출 삭제
export const deleteExpenses = (id) => api.delete(`/expensesdb/${id}`);
