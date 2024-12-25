import { getDatabase } from '../database.js';

export default class Event {
	constructor({ title, date, address, description }) {
		this.title = title;
		this.date = date;
		this.address = address;
		this.description = description;
	}

	async createEvent() {
		const db = getDatabase();
		const stmt = db.prepare(`INSERT INTO events (title, date, address, description) VALUES (?, ?, ?, ?)`);
		const result = stmt.run(this.title, this.date, this.address, this.description);
		this.id = result.lastInsertRowid;
	}

	static async findByIdAndUpdate(id, updateData) {
		const db = getDatabase();
		const stmt = db.prepare(`UPDATE events SET title = ?, date = ?, address = ?, description = ? WHERE id = ?`);
		const result = stmt.run(updateData.title, updateData.date, updateData.address, updateData.description, id);
		if (result.changes === 0) {
			return null;
		}
		return { id, ...updateData };
	}

	static async findByIdAndDelete(id) {
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
}
