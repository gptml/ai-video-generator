import { Router } from 'express';
import MainController from '../controllers/MainController.js';
import users from "./users.js";
import videoGenerator from "./videoGenerator.js";

const router = Router();

router.get('/', MainController.index);

router.use('/users', users);

router.use('/video-generator', videoGenerator);


export default router;
