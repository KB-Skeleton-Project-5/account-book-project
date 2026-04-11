import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// 태그 전체 조회
export const getTags = () => api.get('/tagsdb');

// 태그 추가
export const createTag = (data) => api.post('/tagsdb', data);

// 태그 삭제
export const deleteTag = (id) => api.delete(`/tagsdb/${id}`);
