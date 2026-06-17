import axios from "axios";


const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 10000,
});


api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("mg_user");
    if (storedUser) {
      const { token } = JSON.parse(storedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const movieApi = {
  login: async (credentials: any) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get("/movies/featured");
    return response.data;
  },
  getPopular: async (page = 1) => {
    const response = await api.get(`/movies/popular?page=${page}`);
    return response.data;
  },
  getTopRated: async (page = 1) => {
    const response = await api.get(`/movies/top-rated?page=${page}`);
    return response.data;
  },
  searchMovies: async (query: string, page = 1) => {
    const response = await api.get(`/movies/search?query=${query}&page=${page}`);
    return response.data;
  },
  getMovieDetails: async (id: number) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },
  getArabicFeatured: async () => {
    const response = await api.get("/movies/arabic/featured");
    return response.data;
  },
  getArabicPopular: async (page = 1) => {
    const response = await api.get(`/movies/arabic/popular?page=${page}`);
    return response.data;
  },
  getArabicTopRated: async (page = 1) => {
    const response = await api.get(`/movies/arabic/top-rated?page=${page}`); 
    return response.data;
  },
  
};