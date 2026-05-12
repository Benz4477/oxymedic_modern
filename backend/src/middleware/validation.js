import { body, validationResult } from "express-validator";

// Middleware de validation des entrées
export const validateRequest = (validations) => {
  return async (req, res, next) => {
    // Exécuter les validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Récupérer les erreurs
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }
    
    // Formatter les erreurs pour la réponse
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: "Erreur de validation des données",
      errors: formattedErrors
    });
  };
};

// Règles de validation communes
export const commonValidations = {
  // Validation pour les noms
  name: {
    notEmpty: {
      errorMessage: "Le nom est requis"
    },
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "Le nom doit contenir entre 2 et 50 caractères"
    },
    trim: true
  },
  
  // Validation pour les usernames
  username: {
    notEmpty: {
      errorMessage: "Le nom d'utilisateur est requis"
    },
    isLength: {
      options: { min: 3, max: 30 },
      errorMessage: "Le nom d'utilisateur doit contenir entre 3 et 30 caractères"
    },
    matches: {
      options: /^[a-zA-Z0-9_]+$/,
      errorMessage: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores"
    },
    trim: true
  },
  
  // Validation pour les emails
  email: {
    isEmail: {
      errorMessage: "L'email doit être valide"
    },
    normalizeEmail: true,
    optional: true
  },
  
  // Validation pour les téléphones
  tel: {
    matches: {
      options: /^[+]?[0-9]{10,15}$/,
      errorMessage: "Le numéro de téléphone doit être valide"
    },
    optional: true
  },
  
  // Validation pour les mots de passe
  password: {
    notEmpty: {
      errorMessage: "Le mot de passe est requis"
    },
    isLength: {
      options: { min: 12, max: 128 },
      errorMessage: "Le mot de passe doit contenir au moins 12 caractères"
    },
    custom: {
      options: (value) => {
        if (!value) return false;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[@$!%*?&]/.test(value);
        return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
      },
      errorMessage: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    }
  },
  
  // Validation pour les rôles
  role: {
    isIn: {
      options: ["superadmin", "admin", "commercial", "livreur", "caissier", "comptable", "technicien", "employe"],
      errorMessage: "Le rôle doit être valide"
    }
  },
  
  // Validation pour les montants
  amount: {
    isFloat: {
      errorMessage: "Le montant doit être un nombre valide"
    },
    isDecimal: {
      options: { decimal_digits: '0,2' },
      errorMessage: "Le montant ne peut avoir que 2 décimales maximum"
    },
    toFloat: true
  },
  
  // Validation pour les IDs MongoDB
  mongoId: {
    isMongoId: {
      errorMessage: "L'ID doit être valide"
    }
  }
};

// Sanitization des entrées
export const sanitizeInput = (req, res, next) => {
  // Nettoyer les entrées contre les injections
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  
  next();
};
