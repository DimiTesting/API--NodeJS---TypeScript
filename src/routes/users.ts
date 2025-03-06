import express from 'express'
import {getUsers, getUserById, createUser, updateUser, deletUser} from '../controllers/users'
import {protect, authorize} from '../middlewares/auth';

const router = express.Router();

router.use(protect)
router.use(authorize('admin'))

router
    .route('/')
    .get(getUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deletUser)

export default router