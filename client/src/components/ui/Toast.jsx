import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

// État global pour les toasts
let toastId = 0;
const toasts = new Set();
const listeners = new Set();

// Types de toast avec leurs icônes et couleurs
const toastTypes = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-800",
    iconColor: "text-emerald-600",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
    iconColor: "text-red-600",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    iconColor: "text-amber-600",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
    iconColor: "text-blue-600",
  },
};

// Hook pour gérer les toasts
export const useToast = () => {
  const [currentToasts, setCurrentToasts] = useState([]);

  useEffect(() => {
    listeners.add(setCurrentToasts);
    return () => listeners.delete(setCurrentToasts);
  }, []);

  return currentToasts;
};

// Fonction pour ajouter un toast
export const showToast = (message, type = "info", duration = 3000) => {
  const id = ++toastId;
  const toast = {
    id,
    message,
    type,
    duration,
    createdAt: Date.now(),
  };

  toasts.add(toast);
  notifyListeners();

  // Auto-suppression après la durée
  setTimeout(() => {
    removeToast(id);
  }, duration);

  return id;
};

// Fonction pour supprimer un toast
export const removeToast = (id) => {
  toasts.forEach((toast) => {
    if (toast.id === id) {
      toasts.delete(toast);
      notifyListeners();
    }
  });
};

// Notifier tous les listeners
const notifyListeners = () => {
  listeners.forEach((listener) => {
    listener(Array.from(toasts));
  });
};

// Fonctions pratiques pour chaque type
export const toast = {
  success: (message, duration) => showToast(message, "success", duration),
  error: (message, duration) => showToast(message, "error", duration),
  warning: (message, duration) => showToast(message, "warning", duration),
  info: (message, duration) => showToast(message, "info", duration),
};

// Composant Toast principal
export const Toast = () => {
  const currentToasts = useToast();

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {currentToasts.map((toast) => {
        const config = toastTypes[toast.type] || toastTypes.info;
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`
              ${config.bgColor} ${config.borderColor} ${config.textColor}
              border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md
              transform transition-all duration-300 ease-in-out
              animate-in slide-in-from-right-full
              flex items-start gap-3 pointer-events-auto
            `}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
