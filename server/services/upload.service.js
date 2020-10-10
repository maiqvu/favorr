import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import Proof from '../models/proof.model';
import multer from 'multer';

var storage = multer.memoryStorage();

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

export default {
    upload: multer({ storage: storage }),
    s3Upload: async (file, favorId) => {
        // Prepare parameters for upload
        let params = {
            Bucket: process.env.BUCKET_NAME,
            Key: uuidv4() + '.jpg', //file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };
        // Upload image to s3
        const stored = await s3.upload(params).promise()
        let newFileUploaded = {
            favorId: favorId,
            fileLink: process.env.AWS_UPLOADED_FILE_URL_LINK + params.Key, //file.originalname,
            s3Key: params.Key
        };
        let proof = new Proof(newFileUploaded);
        await proof.save()
        return stored;
    }
}