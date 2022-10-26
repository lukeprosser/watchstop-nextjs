import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express'; // Workaround for Multer file type (https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18569)
import multer from 'multer';
import streamifier from 'streamifier';
import { isAuthenticated, isAdministrator } from '../../../utils/auth';

interface IMulterRequest extends NextApiRequest {
  file: Express.Multer.File;
}

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

const handler = nc<IMulterRequest, NextApiResponse>({
  onError: async (err, req, res) => {
    res.status(500).send({ message: err.toString() });
  },
});

const upload = multer();

// Define middleware, including file upload
handler.use(isAuthenticated, isAdministrator);
handler.use(upload.single('file'));

handler.post(async (req, res) => {
  // Upload file Buffer from memory (https://support.cloudinary.com/hc/en-us/community/posts/360007581379-Correct-way-of-uploading-from-buffer-)
  const uploadFromBuffer = (req: IMulterRequest) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'watchstop',
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });
  };
  const result = await uploadFromBuffer(req);
  res.send(result);
});

export default handler;
