import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 처리
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) => api.post('/auth/register', userData),

  getProfile: () => api.get('/auth/profile'),
};

// 사용자 관련 API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id: string) => api.get(`/users/${id}`),
  createUser: (userData: any) => api.post('/users', userData),
  updateUser: (id: string, userData: any) =>
    api.patch(`/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};
