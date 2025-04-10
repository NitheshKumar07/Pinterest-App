const multer = require('multer');
const {v4 : uuidv4} = require('uuid');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary')

const dpstorage = new CloudinaryStorage({
  
    cloudinary : cloudinary,
    params : {
      folder : 'userDps',
      allowed_formats : ['jpg', 'jpeg', 'png', 'webp']
    }

  })
    
  const uploaddp = multer({ storage : dpstorage });

  const pinstorage = new CloudinaryStorage({

    cloudinary : cloudinary,
    params : {
      folder : 'pins' ,
      allowed_formats : ['jpg', 'jpeg', 'png', 'webp']
    }

  })
  
  const uploadpin = multer({ storage : pinstorage });

  module.exports = {uploaddp, uploadpin};