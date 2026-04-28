import React, { useState, useEffect } from "react";
import {
  User,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Eye,
  Shield,
  Lock,
  CheckCircle,
  Users,
  Settings,
  Database,
  FileText,
  AlertTriangle,
} from "lucide-react";

const DroitsAcces = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    // Simulation de données utilisateurs
    setUsers([
      {
        id: 1,
        nom: "Admin Principal",
        email: "admin@oxymedic.com",
        role: "admin",
        roleName: "Administrateur",
        statut: "actif",
        derniereConnexion: "2024-03-20 14:30",
        dateCreation: "2023-01-01",
      },
      {
        id: 2,
        nom: "Dr. Mohamed Benali",
        email: "benali@oxymedic.com",
        role: "medecin",
        roleName: "Médecin",
        statut: "actif",
        derniereConnexion: "2024-03-20 09:15",
        dateCreation: "2023-02-15",
      },
      {
        id: 3,
        nom: "Fatima Alami",
        email: "alami@oxymedic.com",
        role: "infirmiere",
        roleName: "Infirmière",
        statut: "actif",
        derniereConnexion: "2024-03-19 16:45",
        dateCreation: "2023-03-10",
      },
      {
        id: 4,
        nom: "Karim Mansouri",
        email: "mansouri@oxymedic.com",
        role: "technicien",
        roleName: "Technicien",
        statut: "inactif",
        derniereConnexion: "2024-03-10 11:20",
        dateCreation: "2023-04-05",
      },
    ]);

    // Simulation de données rôles
    setRoles([
      {
        id: 1,
        nom: "Administrateur",
        niveau: 5,
        description: "Accès complet à toutes les fonctionnalités",
        statut: "actif",
        nombreUtilisateurs: 1,
        permissions: ["all"],
      },
      {
        id: 2,
        nom: "Médecin",
        niveau: 4,
        description: "Accès aux dossiers patients et prescriptions",
        statut: "actif",
        nombreUtilisateurs: 8,
        permissions: ["patients", "ordonnances", "consultations"],
      },
      {
        id: 3,
        nom: "Infirmière",
        niveau: 3,
        description: "Accès aux soins de base et suivi patients",
        statut: "actif",
        nombreUtilisateurs: 12,
        permissions: ["patients", "soins", "planning"],
      },
      {
        id: 4,
        nom: "Technicien",
        niveau: 2,
        description: "Maintenance et gestion des équipements",
        statut: "actif",
        nombreUtilisateurs: 3,
        permissions: ["equipements", "maintenance"],
      },
      {
        id: 5,
        nom: "Secrétaire",
        niveau: 1,
        description: "Prise de rendez-vous et accueil",
        statut: "actif",
        nombreUtilisateurs: 5,
        permissions: ["rendezvous", "patients_lecture"],
      },
    ]);

    // Simulation de données permissions
    setPermissions([
      {
        id: 1,
        nom: "Gestion des patients",
        module: "patients",
        description: "Créer, modifier, supprimer les dossiers patients",
      },
      {
        id: 2,
        nom: "Prescriptions médicales",
        module: "ordonnances",
        description: "Créer et gérer les ordonnances",
      },
      {
        id: 3,
        nom: "Gestion du stock",
        module: "stock",
        description: "Gérer les médicaments et équipements",
      },
      {
        id: 4,
        nom: "Facturation",
        module: "facturation",
        description: "Créer et gérer les factures",
      },
      {
        id: 5,
        nom: "Rapports",
        module: "rapports",
        description: "Accéder aux rapports et statistiques",
      },
      {
        id: 6,
        nom: "Utilisateurs",
        module: "utilisateurs",
        description: "Gérer les comptes utilisateurs",
      },
    ]);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.roleName === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "actif":
        return <span className="badge badge-success">Actif</span>;
      case "inactif":
        return <span className="badge badge-warning">Inactif</span>;
      case "suspendu":
        return <span className="badge badge-danger">Suspendu</span>;
      default:
        return <span className="badge">{statut}</span>;
    }
  };

  const getNiveauColor = (niveau) => {
    if (niveau >= 5) return "#DC2626"; // red-600
    if (niveau >= 4) return "#D97706"; // amber-600
    if (niveau >= 3) return "#059669"; // emerald-600
    if (niveau >= 2) return "#2563EB"; // blue-600
    return "#6B7280"; // gray-500
  };

  const handleAddRole = () => {
    // Logique pour ajouter un rôle
  };

  const handleAddUser = () => {
    // Logique pour ajouter un utilisateur
  };

  const handleEditRole = (role) => {
    // Logique pour modifier un rôle
  };

  const handleEditUser = (user) => {
    // Logique pour modifier un utilisateur
  };

  const handleViewPermissions = (user) => {
    // Logique pour afficher les permissions d'un utilisateur
  };

  const totalUtilisateurs = users.length;
  const totalActifs = users.filter((u) => u.statut === "actif").length;
  const totalRoles = roles.length;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Droits d'Accès
          </h1>
          <p className="text-gray-600 text-sm">
            {totalUtilisateurs} utilisateurs • {totalRoles} rôles •{" "}
            {totalActifs} actifs
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={handleAddRole}
          >
            <Plus size={16} />
            Nouveau rôle
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={handleAddUser}
          >
            <User size={16} />
            Nouvel utilisateur
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalUtilisateurs}
              </div>
              <div className="text-xs text-gray-600">Utilisateurs totaux</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalActifs}
              </div>
              <div className="text-xs text-gray-600">Utilisateurs actifs</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalRoles}
              </div>
              <div className="text-xs text-gray-600">Rôles définis</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Lock size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {permissions.length}
              </div>
              <div className="text-xs text-gray-600">Permissions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div className="card mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={18} />
          Rôles et Permissions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {role.nom}
                  </h4>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: getNiveauColor(role.niveau) }}
                  >
                    Niveau {role.niveau}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    className="btn btn-xs btn-sec"
                    onClick={() => handleEditRole(role)}
                  >
                    <Edit size={12} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2">{role.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-700">
                  {role.nombreUtilisateurs} utilisateurs
                </span>
                {getStatusBadge(role.statut)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <User size={18} />
            Utilisateurs
          </h3>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm"
            >
              <option value="">Tous les rôles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.nom}>
                  {role.nom}
                </option>
              ))}
            </select>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Dernière connexion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="font-semibold text-gray-900 text-sm">
                    {user.nom}
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">{user.email}</div>
                </td>
                <td>
                  <span className="bg-blue-100 px-2 py-0.5 rounded text-xs">
                    {user.roleName}
                  </span>
                </td>
                <td>{getStatusBadge(user.statut)}</td>
                <td>
                  <div className="text-sm text-gray-700">
                    {user.derniereConnexion}
                  </div>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleEditUser(user)}
                      title="Modifier l'utilisateur"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewPermissions(user)}
                      title="Voir les permissions"
                    >
                      <Eye size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center p-10 text-gray-600">
            <Shield size={48} className="mx-auto mb-4 opacity-30" />
            <div>Aucun utilisateur trouvé</div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings size={18} />
          Actions rapides
        </h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Ajouter un utilisateur
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Shield size={16} />
            Créer un rôle
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Database size={16} />
            Sauvegarder les permissions
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <FileText size={16} />
            Exporter les accès
          </button>
        </div>
      </div>
    </div>
  );
};

export default DroitsAcces;
