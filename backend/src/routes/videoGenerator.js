import { Router } from 'express';
import VideoGeneratorController from "../controllers/VideoGeneratorController.js";
import upload from "../middlewares/uploader.js";
import checkRole from "../middlewares/checkRole.js";
import validate from "../middlewares/validate.js";

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
  upload(['image/png', 'image/jpg', 'image/jpeg']).any(),
  validate('videoGenerator.generate'),
  VideoGeneratorController.generateOtherModel
);


router.post(
  '/generate/video/:model',
  upload([
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv',
    'video/x-matroska',
    'video/mpeg',
  ]).single('video'),
  VideoGeneratorController.generateOtherModelVideo
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

router.get(
  '/single-model',
  VideoGeneratorController.getSingleModel
);

router.post(
  '/change-token-count',
  checkRole('admin'),
  VideoGeneratorController.changeModelToken
);


export default router;
