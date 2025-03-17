import express from 'express';
import { getUser, logIn, logOut, signUp } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleLayers/protectRoute.js';

const router = express.Router();

router.get('/getUser', protectedRoute, getUser);
router.post('/signUp', signUp );
router.post('/logIn', logIn);
router.post('/logOut', logOut);

export default router;