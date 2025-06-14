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
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('TEST SERVER from NODEJS + EXPRESSJS');
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
