import express from "express";
import {fetchTimeEditData} from './timeedit';
import {postToCanvas} from './canvas';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/timeedit', async (req, res) => {
    const data = await fetchTimeEditData();
    res.json(data);
});

app.post('/canvas', async (req, res) => {
    const result = await postToCanvas(req.body);
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});