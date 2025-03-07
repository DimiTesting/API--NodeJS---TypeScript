import { Router } from 'express';
import {getBootcamps, getBootcamp, createBootcamp, 
        updateBootcamp, deleteBootcamp, deleteAllBootcamp, 
        getBootcampsInRadius,
        uploadPhoto
    } from '../controllers/bootcamps';
import coursesRouter from './courses'
import reviewsRouter from './reviews'
import {protect, authorize} from '../middlewares/auth'

const router = Router()

router.use('/:bootcampId/courses', coursesRouter);
router.use('/:bootcampId/reviews', reviewsRouter);

router
    .route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), uploadPhoto)

router
    .route('/')
    .get(getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteAllBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

export default router
