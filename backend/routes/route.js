import express from 'express';
import { fetchData, insertData, insertPassword, securityPoolDBController, testController } from '../controller/controller.js';

const router = express.Router();

router.get('/test', testController);
router.get('/dbTest', securityPoolDBController);
router.post('/insertData', insertData);
router.post('/fetchData', fetchData);
router.post('/insertPassword', insertPassword)

export default router;