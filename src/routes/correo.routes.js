import { Router } from 'express'
const router = Router();
const {checkToken}=require('../auth/token_validation');
import * as emailCtr from '../controllers/correo.controller';
router.post("/",checkToken, emailCtr.registerEmail);
export default router;