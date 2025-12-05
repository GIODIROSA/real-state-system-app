import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  // cookies permite la ida y la vuelta
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.reponse?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
