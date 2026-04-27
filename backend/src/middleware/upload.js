import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import path from 'path'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Configuration de stockage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'oxymedic',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
    public_id: (req, file) => {
      const timestamp = Date.now()
      const originalName = file.originalname.split('.')[0]
      return `${originalName}_${timestamp}`
    },
    transformation: [
      { width: 800, height: 600, crop: 'limit', quality: 'auto' }
    ]
  }
})

// Configuration de stockage local (fallback)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads')
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const originalName = file.originalname.split('.')[0]
    const extension = path.extname(file.originalname)
    cb(null, `${originalName}_${timestamp}${extension}`)
  }
})

// Configuration Multer
const uploadConfig = {
  storage: process.env.CLOUDINARY_CLOUD_NAME ? storage : localStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // Maximum 10 fichiers
  },
  fileFilter: (req, file, cb) => {
    // Types de fichiers autorisés
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`Type de fichier non autorisé: ${file.mimetype}`), false)
    }
  }
}

// Différentes configurations selon le type d'upload
export const upload = multer(uploadConfig)

export const uploadSingle = (fieldName) => upload.single(fieldName)

export const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount)

export const uploadFields = (fields) => upload.fields(fields)

// Configuration spécifique pour les documents
export const uploadDocuments = upload.fields([
  { name: 'cinRecto', maxCount: 1 },
  { name: 'cinVerso', maxCount: 1 },
  { name: 'permis', maxCount: 1 },
  { name: 'passeport', maxCount: 1 },
  { name: 'carteFiscale', maxCount: 1 },
  { name: 'registreCommerce', maxCount: 1 },
  { name: 'contrat', maxCount: 1 },
  { name: 'facture', maxCount: 1 },
  { name: 'devis', maxCount: 1 },
  { name: 'bonLivraison', maxCount: 1 }
])

// Configuration pour les images d'équipements
export const uploadEquipmentImages = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'images', maxCount: 5 }
])

// Configuration pour les avatars
export const uploadAvatar = upload.single('avatar')

// Middleware pour gérer les erreurs d'upload
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Fichier trop volumineux (maximum 5MB)'
      })
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Trop de fichiers (maximum 10)'
      })
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Champ de fichier non attendu'
      })
    }
  }
  
  if (error.message.includes('Type de fichier non autorisé')) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
  
  next(error)
}

// Utilitaire pour supprimer une image de Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw error
  }
}

// Utilitaire pour optimiser les images
export const optimizeImage = (publicId, options = {}) => {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
    crop: 'limit'
  }
  
  return cloudinary.url(publicId, { ...defaultOptions, ...options })
}

export default upload
