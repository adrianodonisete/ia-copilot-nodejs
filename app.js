import express from 'express';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import { initializeDatabase } from './database.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/users', userRoutes);
app.use('/events', eventRoutes);

app.listen(process.env.PORT || 3000, () => {
	console.log('Server listening on port 3000');

	try {
		initializeDatabase();
	} catch (error) {
		console.error('Failed to initialize the database:', error);
		process.exit(1);
	}
});
