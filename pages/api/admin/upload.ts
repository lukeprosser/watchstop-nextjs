import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';
import { isAuthenticated, isAdministrator } from '../../../utils/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Consume image upload as stream (https://nextjs.org/docs/api-routes/request-helpers)
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: async (err, req, res) => {
    res.status(500).send({ message: err.toString() });
  },
});

const upload = multer();

// Upload file Buffer from memory (https://support.cloudinary.com/hc/en-us/community/posts/360007581379-Correct-way-of-uploading-from-buffer-)
handler
  .use(isAuthenticated, isAdministrator, upload.single('file'))
  .post(async (req, res) => {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  });

handler.post(async (req, res) => {
  console.log(req.body);
});

export default handler;
