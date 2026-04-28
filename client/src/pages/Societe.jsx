import React, { useState, useEffect } from "react";
import {
  Building,
  Phone,
  Mail,
  Globe,
  MapPin,
  Users,
  CreditCard,
  FileText,
  Save,
  Check,
  Settings,
  Upload,
  Download,
} from "lucide-react";

const Societe = () => {
  const [societeInfo, setSocieteInfo] = useState({
    nom: "Oxymedic Maroc",
    raisonSociale: "Oxymedic SARL",
    siret: "12345678900012",
    rc: "RC-12345",
    patente: "PAT-67890",
    if: "IF-111222333",
    cnss: "CNSS-444555666",
    dateCreation: "2020-01-15",
    capital: "500000",
    nombreEmployes: "25",
    adresse: "123 Avenue Hassan II",
    ville: "Casablanca",
    codePostal: "20000",
    pays: "Maroc",
    telephone: "+212 522 123 456",
    email: "contact@oxymedic.ma",
    siteWeb: "https://www.oxymedic.ma",
    description:
      "Spécialiste en équipements médicaux et solutions de santé innovantes",
    logo: "",
    siegeSocial: "Casablanca, Maroc",
    secteurActivite: "Santé et équipements médicaux",
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Charger les informations société depuis le localStorage ou API
    const savedInfo = localStorage.getItem("societe-info");
    if (savedInfo) {
      setSocieteInfo(JSON.parse(savedInfo));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setSocieteInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    // Simulation de sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 1500));

    localStorage.setItem("societe-info", JSON.stringify(societeInfo));
    setLoading(false);
    setSaved(true);

    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange("logo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Informations Société
          </h1>
          <p className="text-gray-600 text-sm">
            Configurez les informations de votre entreprise
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Sauvegarde...
            </>
          ) : saved ? (
            <>
              <Check size={16} />
              Enregistré
            </>
          ) : (
            <>
              <Save size={16} />
              Enregistrer
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations générales */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building size={18} />
            Informations générales
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nom de l'entreprise
              </label>
              <input
                type="text"
                value={societeInfo.nom}
                onChange={(e) => handleInputChange("nom", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Raison sociale
              </label>
              <input
                type="text"
                value={societeInfo.raisonSociale}
                onChange={(e) =>
                  handleInputChange("raisonSociale", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                SIRET
              </label>
              <input
                type="text"
                value={societeInfo.siret}
                onChange={(e) => handleInputChange("siret", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                RC
              </label>
              <input
                type="text"
                value={societeInfo.rc}
                onChange={(e) => handleInputChange("rc", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Patente
              </label>
              <input
                type="text"
                value={societeInfo.patente}
                onChange={(e) => handleInputChange("patente", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                IF
              </label>
              <input
                type="text"
                value={societeInfo.if}
                onChange={(e) => handleInputChange("if", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                CNSS
              </label>
              <input
                type="text"
                value={societeInfo.cnss}
                onChange={(e) => handleInputChange("cnss", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Date de création
              </label>
              <input
                type="date"
                value={societeInfo.dateCreation}
                onChange={(e) =>
                  handleInputChange("dateCreation", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Capital social
              </label>
              <input
                type="text"
                value={societeInfo.capital}
                onChange={(e) => handleInputChange("capital", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nombre d'employés
              </label>
              <input
                type="number"
                value={societeInfo.nombreEmployes}
                onChange={(e) =>
                  handleInputChange("nombreEmployes", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Contact et localisation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Phone size={18} />
            Contact et localisation
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Adresse
              </label>
              <input
                type="text"
                value={societeInfo.adresse}
                onChange={(e) => handleInputChange("adresse", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Ville
              </label>
              <input
                type="text"
                value={societeInfo.ville}
                onChange={(e) => handleInputChange("ville", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Code postal
              </label>
              <input
                type="text"
                value={societeInfo.codePostal}
                onChange={(e) =>
                  handleInputChange("codePostal", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Pays
              </label>
              <input
                type="text"
                value={societeInfo.pays}
                onChange={(e) => handleInputChange("pays", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={societeInfo.telephone}
                onChange={(e) => handleInputChange("telephone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                value={societeInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Site web
              </label>
              <input
                type="url"
                value={societeInfo.siteWeb}
                onChange={(e) => handleInputChange("siteWeb", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Siège social
              </label>
              <input
                type="text"
                value={societeInfo.siegeSocial}
                onChange={(e) =>
                  handleInputChange("siegeSocial", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Secteur d'activité
              </label>
              <input
                type="text"
                value={societeInfo.secteurActivite}
                onChange={(e) =>
                  handleInputChange("secteurActivite", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description et Logo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={18} />
              Description de l'entreprise
            </h3>
            <textarea
              value={societeInfo.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded h-32 resize-none"
              placeholder="Décrivez votre entreprise, vos services, votre mission..."
            />
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload size={18} />
              Logo de l'entreprise
            </h3>
            <div className="text-center">
              {societeInfo.logo ? (
                <div className="mb-4">
                  <img
                    src={societeInfo.logo}
                    alt="Logo"
                    className="w-24 h-24 mx-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Building size={32} className="text-gray-400" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="btn btn-sec cursor-pointer"
              >
                <Upload size={16} />
                Changer le logo
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings size={18} />
          Actions rapides
        </h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter les informations
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <FileText size={16} />
            Générer le rapport
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <CreditCard size={16} />
            Informations bancaires
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Users size={16} />
            Gérer les utilisateurs
          </button>
        </div>
      </div>

      {/* Statut de sauvegarde */}
      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Check size={16} />
          Informations sauvegardées avec succès
        </div>
      )}
    </div>
  );
};

export default Societe;
