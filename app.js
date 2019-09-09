const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { buildURL, evalueatePage } = require('./room-crawler');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8080;

app.get('/api/rooms', async (req, res) => {
  try {
    const url = buildURL(req.query);
    const rooms = await evalueatePage(url);

    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});