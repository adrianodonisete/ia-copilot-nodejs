import Database from 'better-sqlite3';

let db = null;

export function initializeDatabase() {
	db = new Database('./database.sqlite');
	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY,
			email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL
		)
	`);
}

export function getDatabase() {
	if (!db) {
		throw new Error('Database not initialized. Call initializeDatabase first.');
	}
	return db;
}
