import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Search,
  Clock,
  User,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  AlertTriangle,
  Package,
  MapPin,
  Phone,
} from "lucide-react";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    // Simulation de données réservations
    setReservations([
      {
        id: 1,
        reference: "RES-2024-001",
        client: "Mohammed Alaoui",
        clientId: 1,
        equipement: "Fauteuil roulant électrique",
        equipementId: 1,
        quantite: 1,
        dateDebut: "25/03/2024",
        dateFin: "25/04/2024",
        duree: "30 jours",
        statut: "confirme",
        montantTotal: 2500,
        montantPaye: 500,
        montantRestant: 2000,
        lieuLivraison: "123 Rue Al Massira, Rabat",
        contactLivraison: "0612345678",
        notes: "Livraison au domicile du client",
        dateReservation: "20/03/2024",
        paiementMode: "virement",
        responsable: "Commercial 1",
      },
      {
        id: 2,
        reference: "RES-2024-002",
        client: "Fatima Zahra Benali",
        clientId: 2,
        equipement: "Lit médicalisé",
        equipementId: 2,
        quantite: 1,
        dateDebut: "28/03/2024",
        dateFin: "28/06/2024",
        duree: "90 jours",
        statut: "en_attente",
        montantTotal: 4500,
        montantPaye: 0,
        montantRestant: 4500,
        lieuLivraison: "Centre de Réadaptation, Casablanca",
        contactLivraison: "0623456789",
        notes: "En attente de confirmation",
        dateReservation: "22/03/2024",
        paiementMode: "espece",
        responsable: "Commercial 2",
      },
      {
        id: 3,
        reference: "RES-2024-003",
        client: "Youssef Amrani",
        clientId: 3,
        equipement: "Oxygène portable",
        equipementId: 3,
        quantite: 2,
        dateDebut: "20/03/2024",
        dateFin: "20/04/2024",
        duree: "30 jours",
        statut: "termine",
        montantTotal: 3000,
        montantPaye: 3000,
        montantRestant: 0,
        lieuLivraison: "Hôpital Ibn Sina, Marrakech",
        contactLivraison: "0634567890",
        notes: "Équipement retourné",
        dateReservation: "15/03/2024",
        paiementMode: "carte",
        responsable: "Commercial 1",
      },
    ]);
  }, []);

  const filteredReservations = reservations.map((reservation) => {
    const matchesSearch =
      reservation.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.equipement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || reservation.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "confirme":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Confirmé
          </span>
        );
      case "en_attente":
        return (
          <span className="badge badge-warning">
            <Clock size={12} /> Attente
          </span>
        );
      case "termine":
        return <span className="badge badge-secondary">Terminé</span>;
      case "annule":
        return <span className="badge badge-danger">Annulé</span>;
      default:
        return <span className="badge badge-secondary">{statut}</span>;
    }
  };

  const handleAddReservation = () => {
    // Logique pour ajouter une réservation
  };

  const handleViewReservation = (reservation) => {
    // Logique pour voir les détails
  };

  const handleEditReservation = (reservation) => {
    // Logique pour modifier
  };

  const handleDeleteReservation = (reservationId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      setReservations(reservations.filter((r) => r.id !== reservationId));
    }
  };

  const handleConfirmReservation = (reservationId) => {
    setReservations(
      reservations.map((r) =>
        r.id === reservationId ? { ...r, statut: "confirme" } : r,
      ),
    );
  };

  const totalConfirmees = reservations.filter(
    (r) => r.statut === "confirme",
  ).length;
  const totalEnAttente = reservations.filter(
    (r) => r.statut === "en_attente",
  ).length;
  const totalValeur = reservations.reduce((sum, r) => sum + r.montantTotal, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Réservations
          </h1>
          <p className="text-gray-600 text-sm">
            {reservations.length} réservations • {totalConfirmees} confirmées •{" "}
            {totalEnAttente} en attente
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddReservation}
        >
          <Plus size={16} />
          Nouvelle réservation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {reservations.length}
              </div>
              <div className="text-xs text-gray-600">Total réservations</div>
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
                {totalConfirmees}
              </div>
              <div className="text-xs text-gray-600">Confirmées</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalEnAttente}
              </div>
              <div className="text-xs text-gray-600">En attente</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalValeur.toLocaleString()} MAD
              </div>
              <div className="text-xs text-gray-600">Valeur totale</div>
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
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Rechercher par référence, client, équipement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Tous les statuts</option>
            <option value="confirme">Confirmé</option>
            <option value="en_attente">En attente</option>
            <option value="annule">Annulé</option>
            <option value="termine">Terminé</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Équipement</th>
              <th>Période</th>
              <th>Montant total</th>
              <th>Statut</th>
              <th>Livraison</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>
                  <div className="font-semibold text-blue-600 font-mono">
                    {reservation.reference}
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    {reservation.client}
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    {reservation.quantite}x {reservation.equipement}
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Calendar size={12} className="text-gray-500" />
                      {reservation.dateDebut}
                    </div>
                    <div>→ {reservation.dateFin}</div>
                    <div className="text-xs text-gray-500">
                      ({reservation.duree})
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm font-semibold text-gray-900">
                    {reservation.montantTotal.toLocaleString()} MAD
                  </div>
                  <div className="text-xs text-gray-500">
                    Payé: {reservation.montantPaye.toLocaleString()} MAD
                  </div>
                </td>
                <td>{getStatusBadge(reservation.statut)}</td>
                <td>
                  <div className="text-sm text-gray-700">
                    <div className="flex items-center gap-1 mb-0.5">
                      <MapPin size={12} className="text-gray-500" />
                      {reservation.lieuLivraison}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone size={12} className="text-gray-500" />
                      {reservation.contactLivraison}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewReservation(reservation)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleEditReservation(reservation)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    {reservation.statut === "en_attente" && (
                      <button
                        className="btn btn-xs btn-sec"
                        onClick={() => handleConfirmReservation(reservation.id)}
                        title="Confirmer"
                      >
                        <CheckCircle size={12} />
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteReservation(reservation.id)}
                      title="Supprimer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredReservations.length === 0 && (
          <div className="text-center p-10 text-gray-600">
            <Calendar size={48} className="mx-auto mb-4 opacity-30" />
            <div>Aucune réservation trouvée</div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={18} />
          Actions rapides
        </h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Nouvelle réservation
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Truck size={16} />
            Planning livraisons
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter les réservations
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Calendar size={16} />
            Calendrier des réservations
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
