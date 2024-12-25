import express from 'express';
import { create, edit, destroy, all, one } from '../controllers/events-controller.js';

const router = express.Router();

router.post('/', create);
router.put('/:id', edit);
router.delete('/:id', destroy);
router.get('/all', all);
router.get('/one/:id', one);

export default router;
