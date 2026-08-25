const express = require('express');
const client = require('./db/client.cjs');
const { getActiveCustomers, postActiveCustomers, moveActiveCustomerToBilled, updateActiveCustomer } = require('./db/active-customers.cjs');
const { getBilledCustomers } = require('./db/billed-customers.cjs');

const app = express();

app.use(express.json());

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

app.post('/active-customers', async (req, res, next) => {
  try {
    const { customerName, location, description, dateOnsite, dateLeaveSite } = req.body;
    const customer = await postActiveCustomers(customerName, location, description, dateOnsite, dateLeaveSite);
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
})

app.post('/active-customers/:id/move-to-billed', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dateBilled } = req.body;
    const billedCustomer = await moveActiveCustomerToBilled(id, dateBilled);
    if (!billedCustomer) {
      return res.status(404).send('Active customer not found');
    }
    res.status(201).json(billedCustomer);
  } catch (err) {
    next(err);
  }
})

app.put('/active-customers/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customerName, location, description, dateOnsite, dateLeaveSite } = req.body;
    const customer = await updateActiveCustomer(id, customerName, location, description, dateOnsite, dateLeaveSite);
    if (!customer) {
      return res.status(404).send('Active customer not found');
    }
    res.json(customer);
  } catch (err) {
    next(err);
  }
})

app.get('/billed-customers', async (req, res, next) => {
  try {
    const customers = await getBilledCustomers();
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