import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ndjs-ia-2024';

export function generateToken(user) {
	const payload = {
		id: user.id,
		email: user.email,
	};

	return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token) {
	return jwt.verify(token, JWT_SECRET);
}
