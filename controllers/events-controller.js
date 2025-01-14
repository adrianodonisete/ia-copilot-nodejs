import Event from '../models/event.js';

const validateRequest = req => {
	const { file, body: data } = req;
	const { title, description, address, date } = data;
	let error = '';
	if (!title?.trim()) {
		error += 'Title is required. ';
	}
	if (!description?.trim()) {
		error += 'Description is required. ';
	}
	if (!address?.trim()) {
		error += 'Address is required. ';
	}
	if (!date || isNaN(Date.parse(date))) {
		error += 'Valid date is required. ';
	}
	if (!file) {
		error += 'Image is required. ';
	}
	if (error) {
		throw new Error(error.trim());
	}
};

const cleanEventData = data => {
	data.title = data?.title.trim();
	data.description = data?.description.trim();
	data.address = data?.address.trim();
	data.date = data?.date.trim();
	return data;
};

export const create = async (req, res) => {
	try {
		validateRequest(req);

		const data = cleanEventData(req.body);
		const image = req.file;

		const ev = await Event.createEvent({ ...data, image: image.filename, userId: req.user.id });
		res.status(201).json(ev);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const edit = async (req, res) => {
	try {
		validateRequest(req);

		const { id } = req.params;
		const data = cleanEventData(req.body);
		const image = req.file;

		const existingEvent = await Event.findById(id);
		if (!existingEvent) {
			return res.status(404).json({ message: 'Event not found' });
		}
		if (existingEvent.user_id !== req.user.id) {
			return res.status(403).json({ message: 'You are not authorized to edit this event' });
		}

		const updated = await Event.updateEvent(id, { ...data, image: image.filename });
		if (!updated) {
			return res.status(404).json({ message: 'Failed to edit this event' });
		}
		res.status(200).json(ev);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const destroy = async (req, res) => {
	try {
		const { id } = req.params;

		const existingEvent = await Event.findById(id);
		if (!existingEvent) {
			return res.status(404).json({ message: 'Event not found' });
		}
		if (existingEvent.user_id !== req.user.id) {
			return res.status(403).json({ message: 'You are not authorized to edit this event' });
		}

		const deleted = await Event.deleteEvent(id);
		if (!deleted) {
			return res.status(404).json({ message: 'Failed to delete this event' });
		}
		res.status(200).json({ message: 'Event deleted successfully' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const all = async (_, res) => {
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

export const register = async (req, res) => {
	try {
		const { id } = req.params;
		const ev = await Event.findById(id);
		if (!ev) {
			return res.status(404).json({ message: 'Event not found' });
		}
		const success = await Event.registerForEvent(id, req.user.id);
		if (!success) {
			return res.status(400).json({ message: 'Failed to register for this event' });
		}
		res.status(200).json({ message: 'Registered successfully' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const unregister = async (req, res) => {
	try {
		const { id } = req.params;
		const ev = await Event.findById(id);
		if (!ev) {
			return res.status(404).json({ message: 'Event not found' });
		}
		const success = await Event.unregisterForEvent(id, req.user.id);
		if (!success) {
			return res.status(400).json({ message: 'Failed to unregister for this event' });
		}
		res.status(200).json({ message: 'Unregistered successfully' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
