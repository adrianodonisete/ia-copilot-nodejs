import { getDatabase } from '../database.js';
import bcrypt from 'bcryptjs';

export async function createUser(userData) {
	const db = getDatabase();
	const { email, password } = userData;

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	try {
		const stmt = db.prepare(`INSERT INTO users (email, password) VALUES (?, ?)`);
		const rs = stmt.run(email, hashedPassword);
		return { id: rs.lastInsertRowid, email };
	} catch (error) {
		console.error('Error preparing statement:', error);
		throw error;
	}
}

export async function verifyUserCredentials(email, password) {
	const db = getDatabase();

	const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
	const user = stmt.get(email);

	if (!user) {
		return false;
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	return isPasswordValid ? { id: user.id, email: user.email } : false;
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
