import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import fs from "fs";

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuration de stockage Cloudinary pour les équipements
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "oxymedic/equipements",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const equipementName = req.body.name || "equipement";
      const cleanName = equipementName.replace(/[^a-zA-Z0-9]/g, "_");
      return `${cleanName}_${timestamp}`;
    },
    transformation: [
      { width: 600, height: 600, crop: "limit", quality: "auto" },
    ],
  },
});

// Configuration de stockage local (fallback)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads", "equipements");
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const equipementName = req.body.name || "equipement";
    const cleanName = equipementName.replace(/[^a-zA-Z0-9]/g, "_");
    const extension = path.extname(file.originalname);
    cb(null, `${cleanName}_${timestamp}${extension}`);
  },
});

// Configuration Multer pour les équipements
const uploadConfig = {
  storage: process.env.CLOUDINARY_CLOUD_NAME ? storage : localStorage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB
    files: 1, // Une seule photo par équipement
  },
  fileFilter: (req, file, cb) => {
    // Vérifier le type de fichier
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Type de fichier non autorisé. Seules les images (JPG, PNG, GIF) sont acceptées.",
        ),
        false,
      );
    }
  },
};

// Middleware d'upload pour les équipements
export const uploadEquipementPhoto = multer(uploadConfig).single("photo");

// Middleware pour gérer les erreurs d'upload
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Fichier trop volumineux. Taille maximale: 3MB",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Trop de fichiers. Maximum: 1 photo par équipement",
      });
    }
  }

  if (err.message.includes("Type de fichier non autorisé")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next(err);
};
