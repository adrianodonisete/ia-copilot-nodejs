import { createUser, findUserByEmail, verifyUserCredentials } from '../models/user.js';
import { generateToken } from '../util/auth.js';

async function signup(req, res) {
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

	const existingUser = await findUserByEmail(email);
	if (existingUser) {
		return res.status(400).json({ message: 'User already exists' });
	}

	const newUser = await createUser({ email, password });
	const token = generateToken(newUser);
	res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, email: newUser.email }, token });
}

async function login(req, res) {
	const { email, password } = req.body;

	if (!email || !password || email.trim() === '' || password.trim() === '') {
		return res.status(400).json({ message: 'Email and password are required' });
	}

	try {
		const user = await verifyUserCredentials(email, password);
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}
		const token = generateToken(user);
		res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email }, token });
	} catch (error) {
		console.error('Error during login:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

export { signup, login };
