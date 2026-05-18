// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import AppLayout from "./components/AppLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "./store/authStore";
import RoleGuard from "./components/RoleGuard";
import Unauthorized from "./pages/Unauthorized/Unauthorized";

// Composant de protection des routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Rediriger vers la page de sélection d'utilisateur avec l'URL de retour
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

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
import Cautions from "./pages/Cautions/Cautions";
import NotFound from "./pages/NotFound/NotFound";
import Livreurs from "./pages/Livreurs/Livreurs";
import Livraisons from "./pages/Livraisons/Livraisons";
import Consommables from "./pages/Consommables/Consommables";
import Maintenance from "./pages/Maintenance/Maintenance";
import Sav from "./pages/Sav/Sav";
import Fidelite from "./pages/Fidelite/Fidelite";
import Magasins from "./pages/Magasins/Magasins";
import Reservations from "./pages/Reservations/Reservations";
import Transferts from "./pages/Transferts/Transferts";

// Constante pour les routes de l'application (sous /app) avec permissions associées
const appRoutes = [
  { path: "", element: <Dashboard />, permission: "dashboard" },
  { path: "dashboard", element: <Dashboard />, permission: "dashboard" },
  { path: "clients", element: <Clients />, permission: "clients" },
  { path: "crm", element: <CRM />, permission: "crm" },
  { path: "pipeline", element: <Pipeline />, permission: "pipeline" },
  { path: "devis", element: <Devis />, permission: "devis" },
  { path: "commandes", element: <Commandes />, permission: "commandes" },
  { path: "contrats", element: <Contrats />, permission: "contrats" },
  { path: "stock", element: <Stock />, permission: "stock" },
  { path: "serials", element: <Serials />, permission: "serials" },
  { path: "facturation", element: <Facturation />, permission: "facturation" },
  { path: "paiements", element: <Paiements />, permission: "paiements" },
  { path: "categories", element: <Categories />, permission: "categories" },
  { path: "utilisateurs", element: <Utilisateurs />, permission: "utilisateurs" },
  { path: "societe", element: <Societe />, permission: "societe" },
  { path: "magasins", element: <Magasins />, permission: "utilisateurs" },
  { path: "cautions", element: <Cautions />, permission: "cautions" },
  { path: "livreurs", element: <Livreurs />, permission: "livreurs" },
  { path: "livraisons", element: <Livraisons />, permission: "livraisons" },
  { path: "consommables", element: <Consommables />, permission: "stock" },
  { path: "maintenance", element: <Maintenance />, permission: "maintenance" },
  { path: "sav", element: <Sav />, permission: "maintenance" },
  { path: "fidelite", element: <Fidelite />, permission: "fidelite" },
  { path: "reservations", element: <Reservations />, permission: "reservations" },
  { path: "transferts", element: <Transferts />, permission: "stock" },
];

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes d'authentification */}
        <Route path="/" element={<LoginScreen />} />

        {/* Route d'accès non autorisé (403) */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Redirection de l'ancien /dashboard vers /app */}
        <Route
          path="/dashboard"
          element={<Navigate to="/app/dashboard" replace />}
        />

        {/* Routes principales avec layout et protection de session */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {appRoutes.map((route, idx) => (
            <Route
              key={idx}
              element={<RoleGuard requiredPermission={route.permission} />}
            >
              <Route path={route.path} element={route.element} />
            </Route>
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
