const express = require('express')
const app = express()
const port = 3000

const data = [
  {
    "name": "123",
    "desc": "test"
  },
  {
    "name": "456",
    "desc": "test"
  },
  {
    "name": "789",
    "desc": "test"
  }
] 

app.get('/', (req, res) => {
  res.send('Timeweb Cloud + Express = ️ ❤️')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
