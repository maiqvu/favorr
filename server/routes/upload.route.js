import 'dotenv/config';
import express from 'express';
import UploadService from '../services/upload.service';

const uploadRouter = express.Router();

// Uploads an image
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
