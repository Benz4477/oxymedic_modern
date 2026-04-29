// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserSelection from "./components/UserSelection";
import LoginScreen from "./components/LoginScreen";
import AppLayout from "./components/AppLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import des pages (modules)
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients/Clients";
import CRM from "./pages/CRM/CRM";
import Pipeline from "./pages/Pipeline";
import Devis from "./pages/Devis/Devis";
import Fidelite from "./pages/Fidelite";
import Agenda from "./pages/Agenda";
import Disponibilite from "./pages/Disponibilite";
import Reservations from "./pages/Reservations";
import Contrats from "./pages/Contrats";
import Cautions from "./pages/Cautions";
import Livraisons from "./pages/Livraisons";
import Livreurs from "./pages/Livreurs";
import Stock from "./pages/Stock";
import Serials from "./pages/Serials/Serials";
import Consommables from "./pages/Consommables";
import Facturation from "./pages/Facturation/Facturation";
import Paiements from "./pages/Paiements";
import Catalogue from "./pages/Produits";
import ProdList from "./pages/Parametres";
import Scanner from "./pages/Scanner";
import Analytics from "./pages/Analytics";
import SAV from "./pages/SAV";
import Maintenance from "./pages/Maintenance";
import Apparence from "./pages/Apparence";
import Access from "./pages/DroitsAcces";
import Users from "./pages/Users";
import Categories from "./pages/Categories/Categories";
import Commandes from "./pages/Commandes/Commandes";

// Constante pour les routes de l'application (sous /app)
const appRoutes = [
  { path: "", element: <Dashboard /> }, // index
  { path: "dashboard", element: <Dashboard /> },
  { path: "clients", element: <Clients /> },
  { path: "crm", element: <CRM /> },
  { path: "pipeline", element: <Pipeline /> },
  { path: "devis", element: <Devis /> },
  { path: "commandes", element: <Commandes /> },
  { path: "fidelite", element: <Fidelite /> },
  { path: "agenda", element: <Agenda /> },
  { path: "disponibilite", element: <Disponibilite /> },
  { path: "reservations", element: <Reservations /> },
  { path: "contrats", element: <Contrats /> },
  { path: "cautions", element: <Cautions /> },
  { path: "livraisons", element: <Livraisons /> },
  { path: "livreurs", element: <Livreurs /> },
  { path: "stock", element: <Stock /> },
  { path: "serials", element: <Serials /> },
  { path: "consommables", element: <Consommables /> },
  { path: "facturation", element: <Facturation /> },
  { path: "paiements", element: <Paiements /> },
  { path: "catalogue", element: <Catalogue /> },
  { path: "prodlist", element: <ProdList /> },
  { path: "categories", element: <Categories /> },
  { path: "scanner", element: <Scanner /> },
  { path: "analytics", element: <Analytics /> },
  { path: "sav", element: <SAV /> },
  { path: "maintenance", element: <Maintenance /> },
  { path: "apparence", element: <Apparence /> },
  { path: "access", element: <Access /> },
  { path: "users", element: <Users /> },
];

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes d'authentification */}
        <Route path="/" element={<UserSelection />} />
        <Route path="/login/:userId" element={<LoginScreen />} />

        {/* Redirection de l'ancien /dashboard vers /app */}
        <Route
          path="/dashboard"
          element={<Navigate to="/app/dashboard" replace />}
        />

        {/* Routes principales avec layout */}
        <Route path="/app" element={<AppLayout />}>
          {appRoutes.map((route, idx) => (
            <Route key={idx} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Route 404 (optionnel) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
