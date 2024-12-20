import express from "express";
import {fetchTimeEditData} from './timeedit.js';
import {postToCanvas} from './canvas.js';

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/api/timeedit', async (req, res) => {
    try {
        const data = await fetchTimeEditData();

        // Timeedit returnerar duplicerade värden för kurskod/namn
        // den här funktionen tar bort duplicerade värden
        const cleanedReservations = data.reservations.map(reservation => ({
            ...reservation,
            columns: reservation.columns.map(cell => {
                if (typeof cell === 'string' && cell.includes(',')) {
                    const uniqueValues = Array.from(new Set(cell.split(',').map(val => val.trim())));
                    return uniqueValues.join(', ');
                }
                return cell;
            }),
        }));

        // samma sak för vissa kolumnrubriker
        const cleanedColumnHeaders = data.columnheaders.map(header => {
            if (header.includes(',')) {
                const uniqueValues = Array.from(new Set(header.split(',').map(val => val.trim())));
                return uniqueValues.join(', ');
            }
            return header;
        });

        data.columnheaders = cleanedColumnHeaders;

        res.json({ ...data, reservations: cleanedReservations, columnheaders: cleanedColumnHeaders });
    } catch (error) {
        console.error('Error fetching TimeEdit data:', error);
        res.status(500).json({ error: 'Failed to fetch TimeEdit data' });
    }
});

app.post('/canvas', async (req, res) => {
    const result = await postToCanvas(req.body);
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});