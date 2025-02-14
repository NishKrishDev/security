import express from 'express';
import { fetchData, fetchUserData, insertData, insertPassword, securityPoolDBController, sendFormData, testController } from '../controller/controller.js';

const router = express.Router();

router.get('/test', testController);
router.get('/dbTest', securityPoolDBController);
router.post('/insertData', insertData);
router.post('/fetchData', fetchData);
router.post('/insertPassword', insertPassword);
router.post('/sendformdata', sendFormData);
router.get('/getUserData/:encryptedEmail', fetchUserData)

export default router;