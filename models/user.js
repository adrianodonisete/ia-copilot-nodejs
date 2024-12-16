import { getDatabase } from '../database.js';

export function createUser(userData) {
	const db = getDatabase();

	try {
		const stmt = db.prepare(`INSERT INTO users (email, password) VALUES (?, ?)`);
		const rs = stmt.run(userData.email, userData.password);
		return { id: rs.lastInsertRowid, ...userData };
	} catch (error) {
		console.error('Error preparing statement:', error);
		throw error;
	}
}

export function findUserByEmail(email) {
	const db = getDatabase();

	try {
		const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
		const user = stmt.get(email);
		return user || null;
	} catch (error) {
		console.error('Error preparing statement:', error);
		throw error;
	}
}
