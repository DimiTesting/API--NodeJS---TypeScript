import express from 'express'
import {register, login, getMe, forgotPassword, resetPassword} from '../controllers/auth'
import {protect} from '../middlewares/auth';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resetToken', resetPassword)

export default router