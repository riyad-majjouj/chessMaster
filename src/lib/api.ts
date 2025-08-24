import axios from 'axios';

// تأكد من أن هذا الرابط يطابق الباك اند الذي يعمل لديك (المنفذ 5000)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://chess-master-backend-one.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// هذا هو الجزء الأهم: سيقوم بإضافة التوكن تلقائياً من localStorage إلى كل طلب
api.interceptors.request.use((config) => {
  // اقرأ التوكن مباشرة من localStorage
  const token = localStorage.getItem('authToken');
  
  // إذا وجد التوكن، أضفه إلى هيدر الطلب
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;