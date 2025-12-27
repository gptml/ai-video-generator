import { Router } from 'express';
import UsersController from "../controllers/UsersController.js";
import checkRole from "../middlewares/checkRole.js";

const router = Router();

router.post(
  '/login',
  UsersController.login
);

router.get(
  '/profile',
  UsersController.getProfile
);

router.post(
  '/register',
  UsersController.registerUser
);

router.get(
  '/list',
  UsersController.getUsersList
);

router.post(
  '/update-token',
  UsersController.changeUserToken
);

export default router;
