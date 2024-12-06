// src/utils/authHelper.js


export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null; // Если токен существует, значит пользователь авторизован
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  export const logout = () => {
    localStorage.removeItem('token'); // Удаляет токен из localStorage при выходе
  };