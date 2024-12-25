import Event from '../models/event.js';

export const create = async (req, res) => {
	try {
		const ev = new Event(req.body);
		await ev.createEvent();
		res.status(201).json(ev);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const edit = async (req, res) => {
	try {
		const { id } = req.params;
		const ev = await Event.findByIdAndUpdate(id, req.body, { new: true });
		if (!ev) {
			return res.status(404).json({ message: 'Event not found' });
		}
		res.status(200).json(ev);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const destroy = async (req, res) => {
	try {
		const { id } = req.params;
		const ev = await Event.findByIdAndDelete(id);
		if (!ev) {
			return res.status(404).json({ message: 'Event not found' });
		}
		res.status(200).json({ message: 'Event deleted successfully' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const all = async (req, res) => {
	try {
		const evs = await Event.findAll();
		res.status(200).json(evs);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const one = async (req, res) => {
	try {
		const { id } = req.params;
		const ev = await Event.findById(id);
		if (!ev) {
			return res.status(404).json({ message: 'Event not found' });
		}
		res.status(200).json(ev);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
