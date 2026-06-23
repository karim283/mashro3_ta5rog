import axios from "axios";

const API = axios.create({
   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// ADD THIS — sends token with every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const getGasStations = (lat, lng) =>
  API.get(`/gas-stations?lat=${lat}&lng=${lng}`);

export const registerUser = (userData) =>
  API.post("/register", userData);

export const loginUser = (credentials) =>
  API.post("/login", credentials);

export const updateUserProfile = (userId, data) =>
  API.put(`/users/${userId}`, data);

export const getFavorites = (userId) =>
  API.get(`/favorites/${userId}`);

export const addFavorite = (favoriteData) =>
  API.post("/favorites", favoriteData);

export const removeFavorite = (id) =>
  API.delete(`/favorites/${id}`);

export const getCars = (userId) =>
  API.get(`/cars/${userId}`);

export const addCar = (carData) =>
  API.post("/cars", carData);

export const removeCar = (id) =>
  API.delete(`/cars/${id}`);

export const getAddresses = (userId) =>
  API.get(`/addresses/${userId}`);

export const addAddress = (addressData) =>
  API.post("/addresses", addressData);

export const getServiceHistory = (userId) =>
  API.get(`/service-history/${userId}`);

export const addServiceRecord = (recordData) =>
  API.post("/service-history", recordData);

export const getRepairShops = () =>
  API.get("/repair-shops");

export const getCareCenters = () =>
  API.get("/care-centers");

export const getCategories = () =>
  API.get("/categories");

export const getCarCareImages = () =>
  API.get("/car-care-images");

export const getGasStationsFromDB = () =>
  API.get("/gas-stations-db");
