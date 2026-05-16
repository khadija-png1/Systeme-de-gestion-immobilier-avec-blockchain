import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateRental from "../pages/CreateRental";
import Dashboard from "../pages/Dashboard";
import Rentals from "../pages/Rentals";
import HomePage from "../pages/HomePage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DashboardLocataire from "../pages/locataire/DashboardLocataire";
import DashboardProprietaire from "../pages/proprietaire/DashboardProprietaire";
import AjouterLogement from "../pages/proprietaire/Logements/AjouterLogement";
import ListeLogements from "../pages/proprietaire/Logements/ListeLogements";
import ListeContrats from "../pages/proprietaire/Contrats/ListeContrats";
import CreerContrat from "../pages/proprietaire/Contrats/CreerContrat";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/create" element={<CreateRental />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/DashboardLocataire" element={<DashboardLocataire />} />
        <Route path="/DashboardProprietaire" element={<DashboardProprietaire />} />

        <Route path="/proprietaire/logements/ajouter" element={<AjouterLogement />} />
        <Route path="/proprietaire/logements" element={<ListeLogements />} />
        <Route path="/proprietaire/contrats/creer" element={<CreerContrat />} />
        <Route path="/proprietaire/contrats" element={<ListeContrats />} />
      </Routes>
    </BrowserRouter>
  );
}