const express = require('express');
require('dotenv').config();
const app = express();
const port = 3000;

const data = {
    "DB_NAME": process.env.DB_NAME || "testDB",
    "DB_HOST": process.env.DB_HOST || "localhost",
    "DB_PORT": process.env.DB_PORT || "5432",
};

app.get('/', (req, res) => {
    res.json(data);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
