import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// -----créer contrat
export const createRental = (data) =>
  API.post("/rentals/create", data);

//-----lire contrat
export const getRental = (id) =>
  API.get(`/rentals/${id}`);

// ---- payer loyer
export const payRent = (data) =>
  API.post("/rentals/pay", data);

// -----tous les contrats
export const getAllRentals = () =>
  API.get("/rentals");