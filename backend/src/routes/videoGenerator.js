import { Router } from 'express';
import VideoGeneratorController from "../controllers/VideoGeneratorController.js";
import upload from "../middlewares/uploader.js";
import checkRole from "../middlewares/checkRole.js";

const router = Router();

router.post(
  '/generate/veo3',
  upload(['image/png', 'image/jpg', 'image/jpeg']).array('images[]', 2),
  VideoGeneratorController.generateVeo3
);

router.post(
  '/generate/generate4O',
  upload(['image/png', 'image/jpg', 'image/jpeg']).array('images[]', 5),
  VideoGeneratorController.generate4O
);

router.post(
  '/generate/runaway',
  upload(['image/png', 'image/jpg', 'image/jpeg']).single('image'),
  VideoGeneratorController.generateRunaway
);

router.post(
  '/generate/:model',
  upload(['image/png', 'image/jpg', 'image/jpeg']).array('images[]', 8),
  VideoGeneratorController.generateOtherModel
);

router.get(
  '/check-status',
  VideoGeneratorController.checkContent
);

router.get(
  '/models/list',
  VideoGeneratorController.getModelsList
);


router.get(
  '/history',
  VideoGeneratorController.generationHistory
);

router.post(
  '/change-token-count',
  checkRole('admin'),
  VideoGeneratorController.changeModelToken
);


export default router;
