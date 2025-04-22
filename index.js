import express from "express"

const app = express();
const port = 3000;

const data = [
    {
        "name": "test1",
        "desc": "lorem1"
    },
    {
        "name": "test2",
        "desc": "lorem2"
    },
    {
        "name": "test3",
        "desc": "lorem3"
    },
]

app.get('/', (req, res) => {
  res.json(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});