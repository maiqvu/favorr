import 'dotenv/config';
import express from 'express';
import AWS from 'aws-sdk';
import path from 'path';
import multer from 'multer';
import Proof from '../models/proof.model';
import { v4 as uuidv4} from 'uuid';

const uploadRouter = express.Router();

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

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

uploadRouter.post('/:favorid', upload.single('file'), (req, res) => {
  const file = req.file;
  console.log(file);
  const s3FileUrl = process.env.AWS_UPLOADED_FILE_URL_LINK;

  if (!file.mimetype.includes('image')) {
    res.status(500).json({ error: true, message: 'Uploaded file is not an image!'})
  }

  let params = {
    Bucket: process.env.BUCKET_NAME,
    Key: uuidv4() + '.jpg', //file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  s3.upload(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: true, message: err})
    } else {
      res.send({ data });
      let newFileUploaded = {
        favorId: req.params.favorid,
        fileLink: s3FileUrl + params.Key, //file.originalname,
        s3Key: params.Key
      };
      let proof = new Proof(newFileUploaded);
      proof.save((error, newFile) => {
        if (error) {
          throw error;
        }
      })
    }
  })
})


export default uploadRouter;
