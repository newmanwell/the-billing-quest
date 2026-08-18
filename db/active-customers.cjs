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

module.exports = { postActiveCustomers, getActiveCustomers }