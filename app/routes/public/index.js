import { Router } from 'express';
import { getLandingPage, getRegisterPage, userLogout } from '../../controller/indexController.js';

const router = Router();

router.get('/', getLandingPage);
router.get('/register', getRegisterPage);
router.get('/logout', userLogout);

export default router;