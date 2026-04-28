import React, { useState, useEffect } from "react";
import {
  Palette,
  Save,
  RefreshCw,
  Eye,
  Settings,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";

const Apparence = () => {
  const [theme, setTheme] = useState({
    primaryColor: "#3B82F6",
    secondaryColor: "#6B7280",
    accentColor: "#F59E0B",
    dangerColor: "#EF4444",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    borderRadius: "8px",
    spacing: "normal",
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop");

  useEffect(() => {
    // Charger le thème sauvegardé depuis le localStorage
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
  }, []);

  const handleColorChange = (property, value) => {
    setTheme((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const handleResetTheme = () => {
    const defaultTheme = {
      primaryColor: "#3B82F6",
      secondaryColor: "#6B7280",
      accentColor: "#F59E0B",
      dangerColor: "#EF4444",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      borderRadius: "8px",
      spacing: "normal",
    };
    setTheme(defaultTheme);
  };

  const handleSaveTheme = () => {
    localStorage.setItem("app-theme", JSON.stringify(theme));
    alert("Thème sauvegardé avec succès !");
  };

  const getPreviewStyles = () => {
    return {
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize,
      borderRadius: theme.borderRadius,
      padding: "16px",
      border: `1px solid ${theme.secondaryColor}33`,
    };
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Apparence & Personnalisation
          </h1>
          <p className="text-gray-600 text-sm">
            Personnalisez l'apparence de votre application
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            onClick={handleResetTheme}
          >
            <RefreshCw size={16} />
            Réinitialiser
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={handleSaveTheme}
          >
            <Save size={16} />
            Enregistrer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div>
          {/* Color Settings */}
          <div className="card mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Palette size={18} />
              Couleurs
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Couleur primaire
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) =>
                      handleColorChange("primaryColor", e.target.value)
                    }
                    className="w-10 h-10 border-none rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) =>
                      handleColorChange("primaryColor", e.target.value)
                    }
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Couleur secondaire
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) =>
                      handleColorChange("secondaryColor", e.target.value)
                    }
                    className="w-10 h-10 border-none rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={(e) =>
                      handleColorChange("secondaryColor", e.target.value)
                    }
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Couleur d'accent
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) =>
                      handleColorChange("accentColor", e.target.value)
                    }
                    className="w-10 h-10 border-none rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.accentColor}
                    onChange={(e) =>
                      handleColorChange("accentColor", e.target.value)
                    }
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Couleur de danger
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={theme.dangerColor}
                    onChange={(e) =>
                      handleColorChange("dangerColor", e.target.value)
                    }
                    className="w-10 h-10 border-none rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.dangerColor}
                    onChange={(e) =>
                      handleColorChange("dangerColor", e.target.value)
                    }
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography Settings */}
          <div className="card mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Typographie
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Police de caractères
                </label>
                <select
                  value={theme.fontFamily}
                  onChange={(e) =>
                    handleColorChange("fontFamily", e.target.value)
                  }
                  className="w-full px-2 py-1.5 border border-gray-300 rounded"
                >
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="Roboto, sans-serif">Roboto</option>
                  <option value="Poppins, sans-serif">Poppins</option>
                  <option value="Open Sans, sans-serif">Open Sans</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Taille de police
                </label>
                <select
                  value={theme.fontSize}
                  onChange={(e) =>
                    handleColorChange("fontSize", e.target.value)
                  }
                  className="w-full px-2 py-1.5 border border-gray-300 rounded"
                >
                  <option value="12px">Petit</option>
                  <option value="14px">Normal</option>
                  <option value="16px">Grand</option>
                  <option value="18px">Très grand</option>
                </select>
              </div>
            </div>
          </div>

          {/* Layout Settings */}
          <div className="card mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Mise en page
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Arrondi des coins
                </label>
                <select
                  value={theme.borderRadius}
                  onChange={(e) =>
                    handleColorChange("borderRadius", e.target.value)
                  }
                  className="w-full px-2 py-1.5 border border-gray-300 rounded"
                >
                  <option value="0px">Aucun</option>
                  <option value="4px">Petit</option>
                  <option value="8px">Normal</option>
                  <option value="12px">Grand</option>
                  <option value="16px">Très grand</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Espacement
                </label>
                <select
                  value={theme.spacing}
                  onChange={(e) => handleColorChange("spacing", e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded"
                >
                  <option value="compact">Compact</option>
                  <option value="normal">Normal</option>
                  <option value="relaxed">Détendu</option>
                  <option value="spacious">Spacieux</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="card mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Mode sombre
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-700">
                {isDarkMode ? "Activé" : "Désactivé"}
              </span>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div>
          <div className="card mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye size={18} />
              Aperçu
            </h3>

            {/* Device Selector */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`px-3 py-1.5 rounded text-sm ${
                  previewDevice === "desktop"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <Monitor size={14} className="inline mr-1" />
                Desktop
              </button>
              <button
                onClick={() => setPreviewDevice("tablet")}
                className={`px-3 py-1.5 rounded text-sm ${
                  previewDevice === "tablet"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <Tablet size={14} className="inline mr-1" />
                Tablet
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`px-3 py-1.5 rounded text-sm ${
                  previewDevice === "mobile"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <Smartphone size={14} className="inline mr-1" />
                Mobile
              </button>
            </div>

            {/* Preview Content */}
            <div
              className={`${
                previewDevice === "mobile"
                  ? "max-w-sm"
                  : previewDevice === "tablet"
                    ? "max-w-md"
                    : "w-full"
              } mx-auto`}
            >
              <div style={getPreviewStyles()}>
                <h4 style={{ color: theme.primaryColor, marginBottom: "12px" }}>
                  Titre de l'application
                </h4>
                <p style={{ marginBottom: "16px" }}>
                  Ceci est un aperçu de votre thème personnalisé. Les couleurs,
                  polices et espacements sont appliqués en temps réel.
                </p>
                <div
                  style={{ display: "flex", gap: "8px", marginBottom: "16px" }}
                >
                  <button
                    style={{
                      backgroundColor: theme.primaryColor,
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: theme.borderRadius,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Bouton primaire
                  </button>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      color: theme.primaryColor,
                      padding: "8px 16px",
                      borderRadius: theme.borderRadius,
                      border: `1px solid ${theme.primaryColor}`,
                      cursor: "pointer",
                    }}
                  >
                    Bouton secondaire
                  </button>
                </div>
                <div
                  style={{
                    backgroundColor: theme.secondaryColor + "20",
                    padding: "12px",
                    borderRadius: theme.borderRadius,
                    fontSize: "12px",
                  }}
                >
                  Zone d'information avec couleur secondaire
                </div>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings size={18} />
              Thèmes prédéfinis
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  setTheme({
                    primaryColor: "#3B82F6",
                    secondaryColor: "#6B7280",
                    accentColor: "#F59E0B",
                    dangerColor: "#EF4444",
                    backgroundColor: "#FFFFFF",
                    textColor: "#1F2937",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    borderRadius: "8px",
                    spacing: "normal",
                  })
                }
                className="p-3 border border-gray-200 rounded hover:bg-gray-50"
              >
                <div className="w-full h-8 bg-blue-500 rounded mb-2"></div>
                <div className="text-xs font-medium">Défaut</div>
              </button>

              <button
                onClick={() =>
                  setTheme({
                    primaryColor: "#1F2937",
                    secondaryColor: "#9CA3AF",
                    accentColor: "#F59E0B",
                    dangerColor: "#EF4444",
                    backgroundColor: "#FFFFFF",
                    textColor: "#1F2937",
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "14px",
                    borderRadius: "4px",
                    spacing: "compact",
                  })
                }
                className="p-3 border border-gray-200 rounded hover:bg-gray-50"
              >
                <div className="w-full h-8 bg-gray-800 rounded mb-2"></div>
                <div className="text-xs font-medium">Minimal</div>
              </button>

              <button
                onClick={() =>
                  setTheme({
                    primaryColor: "#8B5CF6",
                    secondaryColor: "#A78BFA",
                    accentColor: "#EC4899",
                    dangerColor: "#EF4444",
                    backgroundColor: "#FFFFFF",
                    textColor: "#1F2937",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "15px",
                    borderRadius: "12px",
                    spacing: "relaxed",
                  })
                }
                className="p-3 border border-gray-200 rounded hover:bg-gray-50"
              >
                <div className="w-full h-8 bg-purple-500 rounded-lg mb-2"></div>
                <div className="text-xs font-medium">Moderne</div>
              </button>

              <button
                onClick={() =>
                  setTheme({
                    primaryColor: "#059669",
                    secondaryColor: "#10B981",
                    accentColor: "#F59E0B",
                    dangerColor: "#EF4444",
                    backgroundColor: "#FFFFFF",
                    textColor: "#1F2937",
                    fontFamily: "Open Sans, sans-serif",
                    fontSize: "14px",
                    borderRadius: "6px",
                    spacing: "normal",
                  })
                }
                className="p-3 border border-gray-200 rounded hover:bg-gray-50"
              >
                <div className="w-full h-8 bg-emerald-600 rounded mb-2"></div>
                <div className="text-xs font-medium">Nature</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apparence;
