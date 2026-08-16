const express = require('express');
const client = require('./db/client.cjs');
const { getActiveCustomers } = require('./db/active-customers.cjs');

const app = express();

app.get('/', (req, res, next) => {
  res.send('Billing Quest Server');
})

app.get('/active-customers', async (req, res, next) => {
  try {
    const customers = await getActiveCustomers();
    res.json(customers);
  } catch (err) {
    next(err);
  }
})

app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
})

app.use((err, req, res, next) => {
  res.status(500).send(err);
})

const PORT = process.env.PORT || 3000;
client.connect().then(() => {
  console.log('Connected to the DB');
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to the DB', err);
});