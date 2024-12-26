import express from "express";
import dotenv from "dotenv";

import {fetchTimeEditData} from './timeedit.js';
import {createEvent} from './canvas.js';

const app = express();

dotenv.config();

const PORT = process.env.PORT;
const token = process.env.TOKEN;

app.use(express.json());

app.get('/api/timeedit', async (req, res) => {
    try {
        const data = await fetchTimeEditData();
        res.json(data);
    } catch (error) {
        console.error('Error fetching TimeEdit data:', error);
        res.status(500).json({ error: 'Failed to fetch TimeEdit data' });
    }
});

app.post('/api/canvas', async (req, res) => {
    try {
        const { context_code, title, description, start_at, end_at, location_name } = req.body;

        if (!context_code || !title || !start_at || !end_at) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const eventData = {
            context_code,
            title,
            description,
            start_at,
            end_at,
            location_name
        };

        const createdEvent = await createEvent(eventData, token);

        res.status(201).json({
            message: 'Event created successfully',
            event: createdEvent
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Failed to create Canvas event', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});