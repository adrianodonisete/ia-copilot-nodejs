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

export function authenticate(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ message: 'Missing authorization header' });
	}

	const [type, token] = authHeader.split(' ');
	if (type !== 'Bearer') {
		return res.status(401).json({ message: 'Invalid authorization type' });
	}

	try {
		const decoded = verifyToken(token);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Invalid token' });
	}
}
