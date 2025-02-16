import { Router } from 'express';
import { getCourses, getSingleCourse, addCourse, updateCourse, deleteCourse } from '../controllers/courses';

const router = Router({mergeParams: true})

router
    .route('/')
    .get(getCourses)
    .post(addCourse)

router
    .route('/:id')
    .get(getSingleCourse)
    .put(updateCourse)
    .delete(deleteCourse)

export default router