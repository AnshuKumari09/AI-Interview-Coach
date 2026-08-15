import axios from "axios";

const API = "https://ai-interview-coach-0mp0.onrender.com";

export const signup = (email, password) => {
  return axios.post(`${API}/signup`, {
    email,
    password,
  });
};

export const login = (email, password) => {
  return axios.post(`${API}/login`, {
    email,
    password,
  });
};
