import React, { useState, useEffect } from "react";
import {
  Users as UsersIcon,
  Plus,
  Search,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Download,
  CheckCircle,
  AlertTriangle,
  Shield,
  Settings,
  UserCheck,
  UserX,
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // Simulation de données utilisateurs
    setUsers([
      {
        id: 1,
        nom: "Admin",
        prenom: "System",
        email: "admin@oxymedic.com",
        tel: "0612345678",
        role: "admin",
        statut: "actif",
        dateEmbauche: "01/01/2024",
        derniereConnexion: "25/03/2024 14:30",
        permissions: {
          dashboard: true,
          clients: true,
          commandes: true,
          stock: true,
          devis: true,
          facturation: true,
          paiements: true,
          cautions: true,
          serials: true,
          livraisons: true,
          livreurs: true,
          users: true,
        },
        service: "Administration",
        matricule: "EMP001",
      },
      {
        id: 2,
        nom: "Benali",
        prenom: "Ahmed",
        email: "ahmed.benali@oxymedic.com",
        tel: "0623456789",
        role: "commercial",
        statut: "actif",
        dateEmbauche: "15/01/2024",
        derniereConnexion: "25/03/2024 09:15",
        permissions: {
          dashboard: true,
          clients: true,
          commandes: true,
          stock: true,
          devis: true,
          facturation: false,
          paiements: false,
          cautions: false,
          serials: false,
          livraisons: false,
          livreurs: false,
          users: false,
        },
        service: "Commercial",
        matricule: "EMP002",
      },
      {
        id: 3,
        nom: "Amrani",
        prenom: "Karim",
        email: "karim.amrani@oxymedic.com",
        tel: "0634567890",
        role: "livreur",
        statut: "actif",
        dateEmbauche: "20/02/2024",
        derniereConnexion: "25/03/2024 07:45",
        permissions: {
          dashboard: true,
          clients: false,
          commandes: false,
          stock: false,
          devis: false,
          facturation: false,
          paiements: false,
          cautions: false,
          serials: false,
          livraisons: true,
          livreurs: false,
          users: false,
        },
        service: "Logistique",
        matricule: "EMP003",
      },
      {
        id: 4,
        nom: "Alaoui",
        prenom: "Fatima",
        email: "fatima.alaoui@oxymedic.com",
        tel: "0645678901",
        role: "caissier",
        statut: "actif",
        dateEmbauche: "10/03/2024",
        derniereConnexion: "24/03/2024 16:20",
        permissions: {
          dashboard: true,
          clients: false,
          commandes: false,
          stock: false,
          devis: false,
          facturation: true,
          paiements: true,
          cautions: true,
          serials: false,
          livraisons: false,
          livreurs: false,
          users: false,
        },
        service: "Finance",
        matricule: "EMP004",
      },
    ]);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tel.includes(searchTerm);
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.statut === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="badge badge-danger">
            <Shield size={12} /> Admin
          </span>
        );
      case "commercial":
        return <span className="badge badge-primary">Commercial</span>;
      case "livreur":
        return <span className="badge badge-info">Livreur</span>;
      case "caissier":
        return <span className="badge badge-success">Caissier</span>;
      case "comptable":
        return <span className="badge badge-warning">Comptable</span>;
      case "technicien":
        return <span className="badge badge-secondary">Technicien</span>;
      case "employe":
        return <span className="badge badge-secondary">Employé</span>;
      default:
        return <span className="badge badge-secondary">{role}</span>;
    }
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "actif":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Actif
          </span>
        );
      case "inactif":
        return (
          <span className="badge badge-danger">
            <AlertTriangle size={12} /> Inactif
          </span>
        );
      case "suspendu":
        return <span className="badge badge-warning">Suspendu</span>;
      default:
        return <span className="badge badge-secondary">{statut}</span>;
    }
  };

  const handleAddUser = () => {
    // Logique pour ajouter un utilisateur
  };

  const handleViewUser = (user) => {
    // Logique pour voir les détails
  };

  const handleEditUser = (user) => {
    // Logique pour modifier
  };

  const handleDeleteUser = (userId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleToggleStatus = (userId) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, statut: u.statut === "actif" ? "inactif" : "actif" }
          : u,
      ),
    );
  };

  const handleEmailUser = (email) => {
    window.open(`mailto:${email}`, "_self");
  };

  const handleCallUser = (tel) => {
    window.open(`tel:${tel}`, "_self");
  };

  const totalActifs = users.filter((u) => u.statut === "actif").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 text-sm">
            {users.length} utilisateurs • {totalActifs} actifs • {totalAdmins}{" "}
            administrateurs
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddUser}
        >
          <Plus size={16} />
          Nouvel utilisateur
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <UsersIcon size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {users.length}
              </div>
              <div className="text-xs text-gray-600">Total utilisateurs</div>
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
              <div className="text-xs text-gray-600">Actifs</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalAdmins}
              </div>
              <div className="text-xs text-gray-600">Administrateurs</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {users.filter((u) => u.statut === "inactif").length}
              </div>
              <div className="text-xs text-gray-600">Inactifs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Rechercher par nom, email, téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employe">Employé</option>
            <option value="livreur">Livreur</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="suspendu">Suspendu</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Contact</th>
              <th>Rôle</th>
              <th>Service</th>
              <th>Dernière connexion</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-base">
                      {user.prenom ? user.prenom.charAt(0) : ""}
                      {user.nom ? user.nom.charAt(0) : ""}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {user.prenom} {user.nom}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.matricule}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Mail size={12} className="text-gray-500" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone size={12} className="text-gray-500" />
                      {user.tel}
                    </div>
                  </div>
                </td>
                <td>{getRoleBadge(user.role)}</td>
                <td>
                  <div className="text-sm text-gray-700">{user.service}</div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {user.derniereConnexion}
                    </div>
                  </div>
                </td>
                <td>{getStatusBadge(user.statut)}</td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewUser(user)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleEditUser(user)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleCallUser(user.tel)}
                      title="Appeler"
                    >
                      <Phone size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleEmailUser(user.email)}
                      title="Envoyer email"
                    >
                      <Mail size={12} />
                    </button>
                    {user.statut === "actif" ? (
                      <button
                        className="btn btn-xs btn-danger"
                        onClick={() => handleToggleStatus(user.id)}
                        title="Désactiver"
                      >
                        <UserX size={12} />
                      </button>
                    ) : (
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => handleToggleStatus(user.id)}
                        title="Activer"
                      >
                        <UserCheck size={12} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--tx3)",
            }}
          >
            <UsersIcon
              size={48}
              style={{ margin: "0 auto", marginBottom: "16px", opacity: "0.3" }}
            />
            <div>Aucun utilisateur trouvé</div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        style={{ marginTop: "24px" }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--tx1)",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Settings size={18} />
          Actions rapides
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Ajouter un utilisateur
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Shield size={16} />
            Gérer les permissions
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter les utilisateurs
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <AlertTriangle size={16} />
            Rapport d'activité
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
