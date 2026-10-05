const client = require("./client.cjs");

// const createActiveCustomers = async(customerName, location, description, dateOnsite, dateLeaveSite) => {
//   try {
//     await client.query(`
//         INSERT INTO active_customers (customer_name, location, description, date_onsite, date_leave_site)
//         VALUES ('${customerName}', '${location}', '${description}', '${dateOnsite}', '${dateLeaveSite}')
//       `);
//   } catch(err) {
//     console.log(err);
//   }
// }

const postActiveCustomers = async(customerName, location, description, dateOnsite, dateLeaveSite) => {
  try {
    const result = await client.query(`
        INSERT INTO active_customers (customer_name, location, description, date_onsite, date_leave_site)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [customerName, location, description, dateOnsite, dateLeaveSite]);
    return result.rows[0];
  } catch(err) {
    console.log(err);
  }
}

const getActiveCustomers = async() => {
  try {
    const result = await client.query('SELECT * FROM active_customers');
    return result.rows;
  } catch(err) {
    console.log(err);
  }
}

const moveActiveCustomerToBilled = async(id, dateBilled) => {
  try {
    await client.query('BEGIN');

    const { rows } = await client.query('SELECT * FROM active_customers WHERE id = $1', [id]);
    const customer = rows[0];
    if (!customer) {
      await client.query('ROLLBACK');
      return null;
    }

    const result = await client.query(`
        INSERT INTO billed_customers (customer_name, location, description, date_onsite, date_leave_site, date_billed)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [customer.customer_name, customer.location, customer.description, customer.date_onsite, customer.date_leave_site, dateBilled]);

    await client.query('DELETE FROM active_customers WHERE id = $1', [id]);

    await client.query('COMMIT');
    return result.rows[0];
  } catch(err) {
    await client.query('ROLLBACK');
    console.log(err);
  }
}

const updateActiveCustomer = async(id, customerName, location, description, dateOnsite, dateLeaveSite) => {
  try {
    const result = await client.query(`
        UPDATE active_customers
        SET customer_name = $1, location = $2, description = $3, date_onsite = $4, date_leave_site = $5
        WHERE id = $6
        RETURNING *
      `, [customerName, location, description, dateOnsite, dateLeaveSite, id]);
    return result.rows[0];
  } catch(err) {
    console.log(err);
  }
}

module.exports = { postActiveCustomers, getActiveCustomers, moveActiveCustomerToBilled, updateActiveCustomer }