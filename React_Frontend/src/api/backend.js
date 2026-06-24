import axios from "axios";
const API="http://localhost:8000";

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
// Start interview (resume)
export const startInterview = async (data, token) => {
  const headers = { Authorization: `Bearer ${token}` };

  const formData = new FormData();
  formData.append("file", data.resumeFile);

  const res = await axios.post(
    `${API}/start-interview`,
    formData,
    { headers, params: { difficulty: data.difficulty } }
  );

  return res.data;
};

// Start interview (qbank)
export const startInterviewQBank = async (data, token) => {
  const headers = { Authorization: `Bearer ${token}` };

  const formData = new FormData();
  formData.append("qbank", data.qbankFile);

  const res = await axios.post(
    `${API}/start-interview-qbank`,
    formData,
    {
      headers,
      params: {
        difficulty: data.difficulty,
        num_questions: data.numQuestions,
      },
    }
  );

  return res.data;
};

// Submit answer
export const submitAnswer = async (payload, token) => {
  const res = await axios.post(
    `${API}/submit-answer`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};


export const speakAsync = async (text) => {
  try {
    await axios.post(`${API}/ai-speak`, { text });
  } catch (err) {
    console.log("Voice error", err);
  }
};
