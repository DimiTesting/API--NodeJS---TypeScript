import { Router } from 'express';
import { getCourses, getSingleCourse, addCourse, updateCourse, deleteCourse } from '../controllers/courses';
import {protect, authorize} from '../middlewares/auth'

const router = Router({mergeParams: true})

router
    .route('/')
    .get(getCourses)
    .post(protect, authorize('publisher', 'admin'), addCourse)

router
    .route('/:id')
    .get(getSingleCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse)

export default router