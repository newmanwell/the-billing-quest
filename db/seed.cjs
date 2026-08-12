const client = require('./client.cjs');

const deleteTables = async() => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS active_customers;
      DROP TABLE IF EXISTS billed_customers;
      `)
  } catch(err) {
    console.log(err);
  }
}

const addTables = async() => {
  try {
    await client.query(`
      CREATE TABLE active_customers (
          id SERIAL PRIMARY KEY,
          customer_name VARCHAR(30) NOT NULL,
          location VARCHAR(30) NOT NULL,
          description TEXT NOT NULL,
          date_onsite VARCHAR(30),
          date_leave_site VARCHAR(30)
        );

        CREATE TABLE billed_customers (
          id SERIAL PRIMARY KEY,
          customer_name VARCHAR(30) NOT NULL,
          location VARCHAR(30) NOT NULL,
          description TEXT NOT NULL,
          date_onsite VARCHAR(30),
          date_leave_site VARCHAR(30),
          date_billed VARCHAR(30)
        );
      `);
  } catch(err) {
    console.log(err);
  }
}

const syncAndSeed = async() => {
  await client.connect();
  console.log('Connected to the DB');

  console.log('Deleting Tables');
  await deleteTables();
  console.log('Tables Deleted');
  
  console.log('Adding Tables');
  await addTables();
  console.log('Tables Added');

  await client.end();
  console.log('Disconnected to the DB');
}

syncAndSeed();