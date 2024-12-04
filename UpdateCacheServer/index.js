const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const port = process.env.PORT || '3030';

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {flags: 'a'}
);

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const logEntry = `${req.method} ${res.statusCode} ${fullUrl}\n`;

  accessLogStream.write(logEntry);

  console.log(logEntry);

  next();
});

app.use(cors());

app.get('/revalidate', async (req, res) => {
  try {
    const pathToRevalidate = req.query.pathToRevalidate;
    if (!pathToRevalidate) {
      res.status(400).send('Missing query parameters');
      return;
    }

    const apiEndpoints = process.env.NEXT_PODS.split(',');
    const responses = await Promise.all(
      apiEndpoints?.map(endpoint =>
        fetch(`${endpoint}/api/revalidate?pathToRevalidate=${pathToRevalidate}`)
      )
    );
    await Promise.all(responses.map(response => response.json()));
    console.log('UpdateCacheServer : Request sended to All Pods');
    res.status(200).send({message: 'Response Revalidate'});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/live', (req, res) => {
  res.json({message: `Server is live`});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
