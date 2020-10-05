import 'dotenv/config';
import express from 'express';
import aws from 'aws-sdk';
import path from 'path';

const uploadRouter = express.Router();

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

uploadRouter.get('/', (req, res) => {
  console.log('image: ', req.file);
  const key = `${Date.now() + req.file.originalname}`;
  console.log(key);
  
  // Pre-signing a putObject operation asynchronously
  s3.getSignedUrl(
    'putObject',
    {
      Bucket: 'something',
      Key: key
    },
    (err, url) => {
      if (err) {
        res.send(err);
      } else {
        console.log(`The URL is ${url}`)
        res.send({key, url})
      }
    }
  );
});

export default uploadRouter;
