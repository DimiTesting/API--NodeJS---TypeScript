import { Router } from 'express';
import {getBootcamps, getBootcamp, createBootcamp, 
        updateBootcamp, deleteBootcamp, deleteAllBootcamp, 
        getBootcampsInRadius
    } from '../controllers/bootcamps';

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

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

export default router
