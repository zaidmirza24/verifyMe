export const login = (token, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

export const getRole = () => localStorage.getItem("role");
export const getToken = () => localStorage.getItem("token");
