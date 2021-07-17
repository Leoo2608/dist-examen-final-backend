import { Router } from 'express'
const router = Router();
import * as emailCtr from '../controllers/correo.controller';
router.post("/", emailCtr.registerEmail);
export default router;