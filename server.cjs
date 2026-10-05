const express = require('express');
const client = require('./db/client.cjs');
const { getActiveCustomers, postActiveCustomers, moveActiveCustomerToBilled, updateActiveCustomer } = require('./db/active-customers.cjs');
const { getBilledCustomers } = require('./db/billed-customers.cjs');
const { getTodosByActiveCustomerId, createTodo, updateTodoCompleted, deleteTodo } = require('./db/active-customer-todos.cjs');

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
    const { customerName, location, description, toDo, dateOnsite, dateLeaveSite } = req.body;
    const customer = await postActiveCustomers(customerName, location, description, toDo, dateOnsite, dateLeaveSite);
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
    const { customerName, location, description, toDo, dateOnsite, dateLeaveSite } = req.body;
    const customer = await updateActiveCustomer(id, customerName, location, description, toDo, dateOnsite, dateLeaveSite);
    if (!customer) {
      return res.status(404).send('Active customer not found');
    }
    res.json(customer);
  } catch (err) {
    next(err);
  }
})

// Get all to-do items for an active customer
app.get('/active-customers/:id/todos', async (req, res, next) => {
  try {
    const { id } = req.params;
    const todos = await getTodosByActiveCustomerId(id);
    res.json(todos);
  } catch (err) {
    next(err);
  }
})

// Add a new to-do item to an active customer
app.post('/active-customers/:id/todos', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const todo = await createTodo(id, text);
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
})

// Toggle a to-do item's completed status
app.patch('/active-customers/:id/todos/:todoId', async (req, res, next) => {
  try {
    const { todoId } = req.params;
    const { completed } = req.body;
    const todo = await updateTodoCompleted(todoId, completed);
    if (!todo) {
      return res.status(404).send('Todo not found');
    }
    res.json(todo);
  } catch (err) {
    next(err);
  }
})

// Delete a to-do item from an active customer
app.delete('/active-customers/:id/todos/:todoId', async (req, res, next) => {
  try {
    const { todoId } = req.params;
    const todo = await deleteTodo(todoId);
    if (!todo) {
      return res.status(404).send('Todo not found');
    }
    res.status(204).send();
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