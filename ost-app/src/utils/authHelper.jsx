// src/utils/authHelper.js
import { jwtDecode } from "jwt-decode"; // Правильный импорт

export const isAuthenticated = () => {
  const token = getToken();
  return token !== null && !isTokenExpired(token); // Проверка на существование и срок действия токена
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token"); // Удаляет токен из localStorage при выходе
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || null; // Возвращает роль пользователя, если она есть
  } catch (error) {
    return null;
  }
};

// Проверка срока действия токена
export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Срок истек, если текущая дата превышает exp
  } catch (error) {
    return true; // Считаем истекшим в случае ошибки
  }
};
