export const saveToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const clearToken = () => {
  localStorage.removeItem('authToken');
};

export const saveUser = (user) => {
  localStorage.setItem('userInfo', JSON.stringify(user));
};

export const getUser = () => {
  const stored = localStorage.getItem('userInfo');
  return stored ? JSON.parse(stored) : null;
};
