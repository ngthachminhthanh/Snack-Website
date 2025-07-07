const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api.router');
const authRouter = require('./routes/auth.router');
require('dotenv').config();

// Kết nối đến MongoDB
const connectDB = require("./database");
connectDB();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);
app.use('/auth', authRouter);

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.send('SERVER from NODEJS + EXPRESSJS IS OK');
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
