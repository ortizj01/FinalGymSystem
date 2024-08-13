import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';





cloudinary.config({
  cloud_name: 'ds5emycb8',
  api_key: '912576334275786',
  api_secret: 'g1Vh0mk2p1JH9bU0MCrKaI_8qhc'
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export { cloudinary, upload };