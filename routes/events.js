import express from 'express';
import { create, edit, destroy, all, one } from '../controllers/events-controller.js';
import Event from '../models/event.js';

const router = express.Router();

router.post('/teste/', (req, res) => {
	const ev = new Event(req.body);
	res.status(201).json({ inputs: req.body, ev });
});
router.post('/', create);
router.put('/:id', edit);
router.delete('/:id', destroy);
router.get('/all', all);
router.get('/one/:id', one);

export default router;
