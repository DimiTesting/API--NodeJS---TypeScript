import { Router } from 'express';
import {getBootcamps, getBootcamp, createBootcamp, 
        updateBootcamp, deleteBootcamp, deleteAllBootcamp, 
        getBootcampsInRadius,
        uploadPhoto
    } from '../controllers/bootcamps';
import coursesRouter from './courses'

const router = Router()

router.use('/:bootcampId/courses', coursesRouter);

router
    .route('/:id/photo')
    .put(uploadPhoto)

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

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

export default router
