import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Plus,
  Search,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Users,
  Target,
} from "lucide-react";

const Pipeline = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    // Simulation de données pipeline
    setLeads([
      {
        id: 1,
        reference: "PPL-2024-001",
        nom: "Clinique El Mansour",
        contact: "Dr. Karim Alaoui",
        tel: "0612345678",
        email: "kalaoui@clinique.com",
        stage: "prospection",
        priorite: "haute",
        valeurEstimee: 150000,
        dateCreation: "15/03/2024",
        dateSuivi: "20/03/2024",
        source: "LinkedIn",
        responsable: "Commercial 1",
        notes: "Intéressé par 10 fauteuils roulants",
        probabilite: 20,
        delaiEstime: "2 mois",
      },
      {
        id: 2,
        reference: "PPL-2024-002",
        nom: "Centre de Réadaptation",
        contact: "Mme. Fatima Zahra",
        tel: "0623456789",
        email: "contact@rehab.ma",
        stage: "qualification",
        priorite: "moyenne",
        valeurEstimee: 85000,
        dateCreation: "18/03/2024",
        dateSuivi: "22/03/2024",
        source: "Référence",
        responsable: "Commercial 2",
        notes: "Besoin de lits médicalisés",
        probabilite: 45,
        delaiEstime: "1 mois",
      },
      {
        id: 3,
        reference: "PPL-2024-003",
        nom: "Hôpital Ibn Sina",
        contact: "Dr. Youssef Amrani",
        tel: "0634567890",
        email: "yamrani@hospitalsina.ma",
        stage: "proposition",
        priorite: "haute",
        valeurEstimee: 250000,
        dateCreation: "20/03/2024",
        dateSuivi: "25/03/2024",
        source: "Salon médical",
        responsable: "Commercial 1",
        notes: "Proposition envoyée, en attente de réponse",
        probabilite: 70,
        delaiEstime: "3 semaines",
      },
    ]);
  }, []);

  const filteredLeads = leads.map((lead) => {
    const matchesSearch =
      lead.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = !stageFilter || lead.stage === stageFilter;
    const matchesPriority = !priorityFilter || lead.priorite === priorityFilter;
    return matchesSearch && matchesStage && matchesPriority;
  });

  const getStageBadge = (stage) => {
    switch (stage) {
      case "prospection":
        return (
          <span className="badge badge-secondary">
            <Target size={12} /> Prospection
          </span>
        );
      case "qualification":
        return <span className="badge badge-info">Qualification</span>;
      case "proposition":
        return <span className="badge badge-warning">Proposition</span>;
      case "négociation":
        return <span className="badge badge-primary">Négociation</span>;
      case "gagné":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Gagné
          </span>
        );
      case "perdu":
        return <span className="badge badge-danger">Perdu</span>;
      default:
        return <span className="badge badge-secondary">{stage}</span>;
    }
  };

  const getPriorityBadge = (priorite) => {
    switch (priorite) {
      case "haute":
        return (
          <span className="badge badge-danger">
            <AlertTriangle size={12} /> Haute
          </span>
        );
      case "moyenne":
        return <span className="badge badge-warning">Moyenne</span>;
      case "basse":
        return <span className="badge badge-success">Basse</span>;
      default:
        return <span className="badge badge-secondary">{priorite}</span>;
    }
  };

  const getProbabilityColor = (probabilite) => {
    if (probabilite >= 70) return "var(--g600)";
    if (probabilite >= 40) return "var(--a600)";
    return "var(--r600)";
  };

  const handleAddLead = () => {
    // Logique pour ajouter un lead
  };

  const handleViewLead = (lead) => {
    // Logique pour voir les détails
  };

  const handleEditLead = (lead) => {
    // Logique pour modifier
  };

  const handleMoveStage = (leadId, newStage) => {
    setLeads(
      leads.map((l) =>
        l.id === leadId
          ? {
              ...l,
              stage: newStage,
              dateSuivi: new Date().toLocaleDateString(),
            }
          : l,
      ),
    );
  };

  const totalValeurEstimee = leads.reduce(
    (sum, lead) => sum + lead.valeurEstimee,
    0,
  );
  const totalGagne = leads.filter((l) => l.stage === "gagné").length;
  const totalPerdu = leads.filter((l) => l.stage === "perdu").length;
  const moyenneProbabilite = Math.round(
    leads.reduce((sum, lead) => sum + lead.probabilite, 0) / leads.length,
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pipeline Commercial
          </h1>
          <p className="text-gray-600 text-sm">
            {leads.length} prospects • {totalGagne} gagnés • {totalPerdu} perdus
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddLead}
        >
          <Plus size={16} />
          Nouveau prospect
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {leads.length}
              </div>
              <div className="text-xs text-gray-600">Total prospects</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalValeurEstimee.toLocaleString()} MAD
              </div>
              <div className="text-xs text-gray-600">Valeur estimée</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {moyenneProbabilite}%
              </div>
              <div className="text-xs text-gray-600">Probabilité moyenne</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalGagne}
              </div>
              <div className="text-xs text-gray-600">Deals gagnés</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Rechercher par référence, nom, contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Toutes les étapes</option>
            <option value="prospection">Prospection</option>
            <option value="qualification">Qualification</option>
            <option value="proposition">Proposition</option>
            <option value="négociation">Négociation</option>
            <option value="gagné">Gagné</option>
            <option value="perdu">Perdu</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Toutes les priorités</option>
            <option value="haute">Haute</option>
            <option value="moyenne">Moyenne</option>
            <option value="basse">Basse</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Pipeline Visual */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} />
          Vue Pipeline
        </h3>
        <div className="grid grid-cols-6 gap-3">
          {[
            "prospection",
            "qualification",
            "proposition",
            "négociation",
            "gagné",
            "perdu",
          ].map((stage, index) => (
            <div key={stage} className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xs font-semibold text-gray-900 mb-2">
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {leads.filter((l) => l.stage === stage).length}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Contact</th>
              <th>Étape</th>
              <th>Priorité</th>
              <th>Valeur estimée</th>
              <th>Probabilité</th>
              <th>Responsable</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "var(--b600)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {lead.reference}
                  </div>
                </td>
                <td>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {lead.nom}
                    </div>
                    <div className="text-xs text-gray-500">{lead.contact}</div>
                  </div>
                </td>
                <td>
                  <div className="text-sm">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Phone size={12} className="text-gray-500" />
                      {lead.tel}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-gray-500" />
                      {lead.email}
                    </div>
                  </div>
                </td>
                <td>{getStageBadge(lead.stage)}</td>
                <td>{getPriorityBadge(lead.priorite)}</td>
                <td>
                  <div className="text-sm font-semibold text-gray-900">
                    {lead.valeurEstimee.toLocaleString()} MAD
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div
                      className="text-base font-semibold"
                      style={{ color: getProbabilityColor(lead.probabilite) }}
                    >
                      {lead.probabilite}%
                    </div>
                    <div className="w-10 h-1 bg-gray-200 rounded overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${lead.probabilite}%`,
                          background: getProbabilityColor(lead.probabilite),
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewLead(lead)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleEditLead(lead)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleMoveStage(lead)}
                      title="Déplacer dans le pipeline"
                    >
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLeads.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--tx3)",
            }}
          >
            <TrendingUp
              size={48}
              style={{ margin: "0 auto", marginBottom: "16px", opacity: "0.3" }}
            />
            <div>Aucun prospect trouvé</div>
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
          <TrendingUp size={18} />
          Actions rapides
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Ajouter un prospect
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Calendar size={16} />
            Planifier suivis
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter le pipeline
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Target size={16} />
            Mettre à jour les probabilités
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
