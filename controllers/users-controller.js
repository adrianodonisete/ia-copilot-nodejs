import { createUser, findUserByEmail } from '../models/user.js';

function signup(req, res) {
	const { email, password } = req.body;

	if (!email || !password || email.trim() === '' || password.trim() === '') {
		return res.status(400).json({ message: 'Email and password are required' });
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({ message: 'Invalid email format' });
	}

	if (password.length < 6) {
		return res.status(400).json({ message: 'Password must be at least 6 characters long' });
	}

	const existingUser = findUserByEmail(email);
	if (existingUser) {
		return res.status(400).json({ message: 'User already exists' });
	}

	const newUser = createUser({ email, password });
	res.status(201).json(newUser);
}

function login(req, res) {
	const { email, password } = req.body;

	if (!email || !password || email.trim() === '' || password.trim() === '') {
		return res.status(400).json({ message: 'Email and password are required' });
	}

	const user = findUserByEmail(email);
	if (!user || user.password !== password) {
		return res.status(400).json({ message: 'Invalid credentials' });
	}
	res.status(200).json({ message: 'Login successful' });
}

export { signup, login };
