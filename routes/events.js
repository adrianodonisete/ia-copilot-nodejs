import express from 'express';
import { create, edit, destroy, all, one, register, unregister } from '../controllers/events-controller.js';
import { authenticate } from '../util/auth.js';
import { upload } from '../util/upload.js';

const router = express.Router();

router.post('/', authenticate, upload.single('image'), create);
router.put('/:id', authenticate, upload.single('image'), edit);
router.delete('/:id', authenticate, destroy);
router.get('/', all);
router.get('/:id', one);

router.post('/:id/register', authenticate, register);
router.post('/:id/unregister', authenticate, unregister);

export default router;
