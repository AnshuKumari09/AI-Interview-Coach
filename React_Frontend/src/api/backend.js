import axios from "axios";
const API="http://127.0.0.1:8000";

export const signup = (email,password)=>{
    return axios.post(`${API}/signup`,null,{params:{email,password}});
}
export const login = (email,password)=>{
    return axios.post(`${API}/login`,null, {params:{email,password}});
}