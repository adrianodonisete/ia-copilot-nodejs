import { getDatabase } from '../database.js';

export default class Event {
	static async createEvent(data) {
		const db = getDatabase();
		const stmt = db.prepare(
			`INSERT INTO events (
        title, date, address, description, image, user_id
      ) VALUES (
        ?, ?, ?, ?, ?, ?
      )`
		);
		const result = stmt.run(data.title, data.date, data.address, data.description, data.image, data.userId);
		const id = result.lastInsertRowid || 0;
		if (id === 0) {
			return null;
		}
		return { id, ...data };
	}
	static async updateEvent(id, updateData) {
		const db = getDatabase();
		const stmt = db.prepare(
			`UPDATE events SET title = ?, date = ?, address = ?, description = ?, image = ? WHERE id = ?`
		);
		const result = stmt.run(
			updateData.title,
			updateData.date,
			updateData.address,
			updateData.description,
			updateData.image,
			id
		);
		if (result.changes === 0) {
			return null;
		}
		return { id, ...updateData };
	}

	static async deleteEvent(id) {
		const db = getDatabase();
		const stmt = db.prepare(`DELETE FROM events WHERE id = ?`);
		const result = stmt.run(id);
		return result.changes > 0;
	}

	static async findAll() {
		const db = getDatabase();
		const stmt = db.prepare(`SELECT * FROM events`);
		return stmt.all();
	}

	static async findById(id) {
		const db = getDatabase();
		const stmt = db.prepare(`SELECT * FROM events WHERE id = ?`);
		return stmt.get(id);
	}

	static async registerForEvent(eventId, userId) {
		const db = getDatabase();
		const stmt = db.prepare(`INSERT INTO registrations (event_id, user_id) VALUES (?, ?)`);
		const result = stmt.run(eventId, userId);
		return result.changes > 0;
	}

	static async unregisterForEvent(eventId, userId) {
		const db = getDatabase();
		const stmt = db.prepare(`DELETE FROM registrations WHERE event_id = ? AND user_id = ?`);
		const result = stmt.run(eventId, userId);
		return result.changes > 0;
	}
}
