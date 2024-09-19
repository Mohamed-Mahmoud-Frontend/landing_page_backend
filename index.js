const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000 || process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

let orders = [];

app.post('/api/orders', (req, res) => {
  const order = req.body;
  orders.push(order);
  res.status(201).send({ message: 'Order received', order });
});

app.get('/api/orders', (req, res) => {
  res.status(200).json(orders);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
