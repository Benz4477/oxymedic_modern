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
import Dashboard from "./pages/Dashboard/Dashboard";
import Clients from "./pages/Clients/Clients";
import CRM from "./pages/CRM/CRM";
import Pipeline from "./pages/Pipeline/Pipeline";
import Devis from "./pages/Devis/Devis";
import Contrats from "./pages/Contrats/Contrats";
import Stock from "./pages/Stock/Stock";
import Serials from "./pages/Serials/Serials";
import Facturation from "./pages/Facturation/Facturation";
import Paiements from "./pages/Paiements/Paiements";
import Utilisateurs from "./pages/Utilisateurs/Utilisateurs";
import Categories from "./pages/Categories/Categories";
import Commandes from "./pages/Commandes/Commandes";
import Societe from "./pages/societe/Societe";
import NotFound from "./pages/NotFound/NotFound";

// Constante pour les routes de l'application (sous /app)
const appRoutes = [
  { path: "", element: <Dashboard /> }, // index
  { path: "dashboard", element: <Dashboard /> },
  { path: "clients", element: <Clients /> },
  { path: "crm", element: <CRM /> },
  { path: "pipeline", element: <Pipeline /> },
  { path: "devis", element: <Devis /> },
  { path: "commandes", element: <Commandes /> },
  { path: "contrats", element: <Contrats /> },
  { path: "stock", element: <Stock /> },
  { path: "serials", element: <Serials /> },
  { path: "facturation", element: <Facturation /> },
  { path: "paiements", element: <Paiements /> },
  { path: "categories", element: <Categories /> }, 
  { path: "utilisateurs", element: <Utilisateurs /> },
  { path: "societe", element: <Societe /> },
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

        {/* Route 404 personnalisée */}
        <Route path="*" element={<NotFound />} />
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
