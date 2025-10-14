const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ FIXED: Generic storage that properly returns public_id
const genericStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine resource type based on file mimetype
    let resourceType = 'auto';
    let folder = 'lms/courses/files';
    
    if (file.mimetype.startsWith('image/')) {
      resourceType = 'image';
      folder = 'lms/courses/images';
    } else if (file.mimetype.startsWith('video/')) {
      resourceType = 'video';
      folder = 'lms/courses/videos';
    } else if (file.mimetype.includes('pdf') || file.mimetype.includes('document')) {
      resourceType = 'raw';
      folder = 'lms/courses/documents';
    }
    
    // Generate a unique public_id
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\.[^/.]+$/, ""); // Remove extension
    const public_id = `${folder}/${originalName}_${timestamp}`;
    
    console.log(`📁 File ${file.fieldname}:`, {
      name: file.originalname,
      type: file.mimetype,
      resourceType: resourceType,
      folder: folder,
      public_id: public_id
    });
    
    return {
      public_id: public_id,
      folder: folder,
      resource_type: resourceType,
      allowed_formats: null
    };
  }
});

// ✅ FIXED: Single multer instance that handles all file types
const genericUploader = multer({
  storage: genericStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  fileFilter: (req, file, cb) => {
    console.log(`✅ Accepting file: ${file.fieldname} - ${file.originalname} (${file.mimetype})`);
    cb(null, true);
  }
});

// Delete function
const deleteFromCloudinary = async (public_id, resource_type = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type
    });
    console.log('✅ Deleted from Cloudinary:', public_id, result);
    return result;
  } catch (error) {
    console.error('❌ Error deleting from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  genericUploader,
  deleteFromCloudinary
};