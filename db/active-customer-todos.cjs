const client = require("./client.cjs");

const getTodosByActiveCustomerId = async(activeCustomerId) => {
  try {
    const result = await client.query(
      'SELECT * FROM active_customer_todos WHERE active_customer_id = $1 ORDER BY id',
      [activeCustomerId]
    );
    return result.rows;
  } catch(err) {
    console.log(err);
  }
}

const createTodo = async(activeCustomerId, text) => {
  try {
    const result = await client.query(`
        INSERT INTO active_customer_todos (active_customer_id, text)
        VALUES ($1, $2)
        RETURNING *
      `, [activeCustomerId, text]);
    return result.rows[0];
  } catch(err) {
    console.log(err);
  }
}

const updateTodoCompleted = async(id, completed) => {
  try {
    const result = await client.query(`
        UPDATE active_customer_todos
        SET completed = $1
        WHERE id = $2
        RETURNING *
      `, [completed, id]);
    return result.rows[0];
  } catch(err) {
    console.log(err);
  }
}

const deleteTodo = async(id) => {
  try {
    const result = await client.query(
      'DELETE FROM active_customer_todos WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  } catch(err) {
    console.log(err);
  }
}

module.exports = { getTodosByActiveCustomerId, createTodo, updateTodoCompleted, deleteTodo }
