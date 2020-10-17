import 'dotenv/config';
import express from 'express';
import path from 'path';
// import multer from 'multer';

import UploadService from '../services/upload.service';

const uploadRouter = express.Router();

// var storage = multer.memoryStorage();
// var upload = multer({ storage: storage });

// uploadRouter.get('/', (req, res) => {
//   console.log('image: ', req.file);
//   const key = `${Date.now() + req.file.originalname}`;
//   console.log(key);
  
//   // Pre-signing a putObject operation asynchronously
//   s3.getSignedUrl(
//     'putObject',
//     {
//       Bucket: 'something',
//       Key: key
//     },
//     (err, url) => {
//       if (err) {
//         res.send(err);
//       } else {
//         console.log(`The URL is ${url}`)
//         res.send({key, url})
//       }
//     }
//   );
// });

uploadRouter.post('/:favorid/:type', UploadService.upload.single('file'), async (req, res) => {
  const file = req.file;
  const favorId = req.params.favorid;
  // This is the type of image that is associated with the favor,
  // either upload when creating a favor (submit) or when repaying a favor (repaid)
  const favorFileType = req.params.type

  if (!file.mimetype.includes('image')) {
    res.status(500).json({ error: true, message: 'Uploaded file is not an image!'})
  }

  try {
    const stored = await UploadService.s3Upload(
      file,
      favorId,
      favorFileType
    );
    res.status(200).send(stored);
  } catch (err) {
    res.status(500).json({ error: true, message: err})
  }
});

export default uploadRouter;
