import React, { useState, useEffect } from "react";
import {
  Settings,
  Database,
  Mail,
  Shield,
  Bell,
  Globe,
  RefreshCw,
  Save,
  Check,
  Lock,
  Key,
  Wifi,
  HardDrive,
  Cloud,
  Smartphone,
  Monitor,
} from "lucide-react";

const Parametres = () => {
  const [settings, setSettings] = useState({
    // Paramètres généraux
    general: {
      nomApplication: "Oxymedic Pro",
      version: "2.0.1",
      environnement: "production",
      fuseauHoraire: "GMT+1",
      langue: "fr",
      theme: "light",
      notifications: true,
      maintenance: false,
    },
    // Base de données
    database: {
      dbHost: "localhost",
      dbPort: "27017",
      dbName: "oxymedic",
      dbUsername: "admin",
      dbPassword: "****",
      dbSSL: true,
      dbTimeout: "30",
    },
    // Email
    email: {
      smtpHost: "smtp.gmail.com",
      smtpPort: "587",
      smtpUsername: "noreply@oxymedic.ma",
      smtpPassword: "****",
      smtpSSL: true,
      emailFrom: "noreply@oxymedic.ma",
      emailReplyTo: "support@oxymedic.ma",
    },
    // Sécurité
    security: {
      sessionTimeout: "30",
      passwordMinLength: "8",
      passwordExpiry: "90",
      twoFactorAuth: true,
      loginAttempts: "5",
      ipWhitelist: "",
      encryptionKey: "****",
    },
    // Notifications
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      lowStockAlert: true,
      maintenanceAlert: true,
      backupAlert: true,
    },
    // Sauvegarde
    backup: {
      autoBackup: true,
      backupFrequency: "daily",
      backupRetention: "30",
      backupLocation: "cloud",
      compression: true,
      encryption: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Charger les paramètres depuis le localStorage ou API
    const savedSettings = localStorage.getItem("app-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleInputChange = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    // Simulation de sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 1500));

    localStorage.setItem("app-settings", JSON.stringify(settings));
    setLoading(false);
    setSaved(true);

    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (
      confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?")
    ) {
      // Réinitialiser aux valeurs par défaut
      const defaultSettings = {
        general: {
          nomApplication: "Oxymedic Pro",
          version: "2.0.1",
          environnement: "production",
          fuseauHoraire: "GMT+1",
          langue: "fr",
          theme: "light",
          notifications: true,
          maintenance: false,
        },
        database: {
          dbHost: "localhost",
          dbPort: "27017",
          dbName: "oxymedic",
          dbUsername: "admin",
          dbPassword: "****",
          dbSSL: true,
          dbTimeout: "30",
        },
        email: {
          smtpHost: "smtp.gmail.com",
          smtpPort: "587",
          smtpUsername: "noreply@oxymedic.ma",
          smtpPassword: "****",
          smtpSSL: true,
          emailFrom: "noreply@oxymedic.ma",
          emailReplyTo: "support@oxymedic.ma",
        },
        security: {
          sessionTimeout: "30",
          passwordMinLength: "8",
          passwordExpiry: "90",
          twoFactorAuth: true,
          loginAttempts: "5",
          ipWhitelist: "",
          encryptionKey: "****",
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          lowStockAlert: true,
          maintenanceAlert: true,
          backupAlert: true,
        },
        backup: {
          autoBackup: true,
          backupFrequency: "daily",
          backupRetention: "30",
          backupLocation: "cloud",
          compression: true,
          encryption: true,
        },
      };
      setSettings(defaultSettings);
    }
  };

  const handleTestConnection = async (type) => {
    // Simulation de test de connexion
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    alert(`Connexion ${type} testée avec succès !`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Paramètres Système
          </h1>
          <p className="text-gray-600 text-sm">
            Configurez les paramètres de l'application
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            onClick={handleReset}
          >
            <RefreshCw size={16} />
            Réinitialiser
          </button>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Paramètres généraux */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings size={18} />
            Général
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nom de l'application
              </label>
              <input
                type="text"
                value={settings.general.nomApplication}
                onChange={(e) =>
                  handleInputChange("general", "nomApplication", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Version
              </label>
              <input
                type="text"
                value={settings.general.version}
                onChange={(e) =>
                  handleInputChange("general", "version", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Environnement
              </label>
              <select
                value={settings.general.environnement}
                onChange={(e) =>
                  handleInputChange("general", "environnement", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="development">Développement</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Fuseau horaire
              </label>
              <select
                value={settings.general.fuseauHoraire}
                onChange={(e) =>
                  handleInputChange("general", "fuseauHoraire", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="GMT+1">GMT+1</option>
                <option value="GMT">GMT</option>
                <option value="GMT-5">GMT-5</option>
                <option value="GMT+8">GMT+8</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Langue
              </label>
              <select
                value={settings.general.langue}
                onChange={(e) =>
                  handleInputChange("general", "langue", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Thème
              </label>
              <select
                value={settings.general.theme}
                onChange={(e) =>
                  handleInputChange("general", "theme", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Base de données */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Database size={18} />
            Base de données
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Hôte
              </label>
              <input
                type="text"
                value={settings.database.dbHost}
                onChange={(e) =>
                  handleInputChange("database", "dbHost", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Port
              </label>
              <input
                type="text"
                value={settings.database.dbPort}
                onChange={(e) =>
                  handleInputChange("database", "dbPort", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nom de la base
              </label>
              <input
                type="text"
                value={settings.database.dbName}
                onChange={(e) =>
                  handleInputChange("database", "dbName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={settings.database.dbUsername}
                onChange={(e) =>
                  handleInputChange("database", "dbUsername", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2">
              <button
                className="btn btn-sec w-full"
                onClick={() => handleTestConnection("base de données")}
              >
                <Wifi size={16} />
                Tester la connexion
              </button>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Mail size={18} />
            Email
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Hôte SMTP
              </label>
              <input
                type="text"
                value={settings.email.smtpHost}
                onChange={(e) =>
                  handleInputChange("email", "smtpHost", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Port SMTP
              </label>
              <input
                type="text"
                value={settings.email.smtpPort}
                onChange={(e) =>
                  handleInputChange("email", "smtpPort", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email d'envoi
              </label>
              <input
                type="email"
                value={settings.email.emailFrom}
                onChange={(e) =>
                  handleInputChange("email", "emailFrom", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email de réponse
              </label>
              <input
                type="email"
                value={settings.email.emailReplyTo}
                onChange={(e) =>
                  handleInputChange("email", "emailReplyTo", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2">
              <button
                className="btn btn-sec w-full"
                onClick={() => handleTestConnection("email")}
              >
                <Mail size={16} />
                Tester l'envoi d'email
              </button>
            </div>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={18} />
            Sécurité
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Timeout session (min)
              </label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  handleInputChange(
                    "security",
                    "sessionTimeout",
                    e.target.value,
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Longueur min mot de passe
              </label>
              <input
                type="number"
                value={settings.security.passwordMinLength}
                onChange={(e) =>
                  handleInputChange(
                    "security",
                    "passwordMinLength",
                    e.target.value,
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Expiration mot de passe (jours)
              </label>
              <input
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) =>
                  handleInputChange(
                    "security",
                    "passwordExpiry",
                    e.target.value,
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tentatives de connexion max
              </label>
              <input
                type="number"
                value={settings.security.loginAttempts}
                onChange={(e) =>
                  handleInputChange("security", "loginAttempts", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) =>
                  handleInputChange(
                    "security",
                    "twoFactorAuth",
                    e.target.checked,
                  )
                }
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-900">
                Activer l'authentification à deux facteurs
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell size={18} />
            Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) =>
                  handleInputChange(
                    "notifications",
                    "emailNotifications",
                    e.target.checked,
                  )
                }
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-900">
                Notifications par email
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifications.smsNotifications}
                onChange={(e) =>
                  handleInputChange(
                    "notifications",
                    "smsNotifications",
                    e.target.checked,
                  )
                }
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-900">
                Notifications SMS
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifications.pushNotifications}
                onChange={(e) =>
                  handleInputChange(
                    "notifications",
                    "pushNotifications",
                    e.target.checked,
                  )
                }
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-900">
                Notifications push
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifications.lowStockAlert}
                onChange={(e) =>
                  handleInputChange(
                    "notifications",
                    "lowStockAlert",
                    e.target.checked,
                  )
                }
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-900">
                Alertes de stock faible
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifications.maintenanceAlert}
                onChange={(e) =>
                  handleInputChange(
                    "notifications",
                    "maintenanceAlert",
                    e.target.checked,
                  )
                }
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-900">
                Alertes de maintenance
              </label>
            </div>
          </div>
        </div>

        {/* Sauvegarde */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HardDrive size={18} />
            Sauvegarde
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Fréquence de sauvegarde
              </label>
              <select
                value={settings.backup.backupFrequency}
                onChange={(e) =>
                  handleInputChange("backup", "backupFrequency", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="hourly">Chaque heure</option>
                <option value="daily">Quotidien</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Rétention (jours)
              </label>
              <input
                type="number"
                value={settings.backup.backupRetention}
                onChange={(e) =>
                  handleInputChange("backup", "backupRetention", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Emplacement
              </label>
              <select
                value={settings.backup.backupLocation}
                onChange={(e) =>
                  handleInputChange("backup", "backupLocation", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="local">Local</option>
                <option value="cloud">Cloud</option>
                <option value="both">Les deux</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.backup.compression}
                onChange={(e) =>
                  handleInputChange("backup", "compression", e.target.checked)
                }
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-900">
                Compression activée
              </label>
            </div>
            <div className="col-span-2">
              <button
                className="btn btn-sec w-full"
                onClick={() => handleTestConnection("sauvegarde")}
              >
                <Cloud size={16} />
                Lancer une sauvegarde manuelle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statut de sauvegarde */}
      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Check size={16} />
          Paramètres sauvegardés avec succès
        </div>
      )}
    </div>
  );
};

export default Parametres;
