import { Router } from 'express';
import VideoGeneratorController from "../controllers/VideoGeneratorController.js";
import upload from "../middlewares/uploader.js";

const router = Router();

router.post(
  '/generate/veo3',
  upload(['image/png', 'image/jpg', 'image/jpeg']).array('images[]', 2),
  VideoGeneratorController.generateVeo3
);
router.post(
  '/generate/runaway',
  upload(['image/png', 'image/jpg', 'image/jpeg']).single('image'),
  VideoGeneratorController.generateRunaway
);
router.post(
  '/generate/:model',
  upload(['image/png', 'image/jpg', 'image/jpeg']).single('image'),
  VideoGeneratorController.generateOtherModel
);

router.get(
  '/check-status',
  VideoGeneratorController.checkContent
);


export default router;
