import { Router } from 'express';
import {getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, deleteAllBootcamp} from '../controllers/bootcamps';

const router = Router()

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp)
    .delete(deleteAllBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)


export default router
