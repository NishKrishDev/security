import express from 'express';
import router from './routes/route.js';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json()); // use before routes to ensure req bosy is parsed before any route handler process it
app.use('/', router);
const PORT = 8080;

app.get('/', (req, res) => {
    res.send(`Server is running at http://localhost:${PORT}`)
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})