import { Router } from 'express';
import UsersController from "../controllers/UsersController.js";
import checkRole from "../middlewares/checkRole.js";

const router = Router();

router.post(
  '/login',
  UsersController.login
);

router.post(
  '/profile',
  checkRole('admin'),
  UsersController.getProfile
);

export default router;
