import express from 'express'
import {register, login, logout, getMe, forgotPassword, resetPassword, updateDetails, updatePassword} from '../controllers/auth'
import {protect} from '../middlewares/auth';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/me', protect, getMe)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resetToken', resetPassword)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)

export default router