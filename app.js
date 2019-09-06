const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getRooms } = require('./room-crawler');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8080;

app.get('/api/rooms', (req, res) => {
    console.log(req.query);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});