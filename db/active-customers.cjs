const client = require("./client.cjs");

const createActiveCustomers = async(customerName, location, description, dateOnsite, dateLeaveSite) => {
  try {
    await client.query(`
        INSERT INTO active_customers (customer_name, location, description, date_onsite, date_leave_site)
        VALUES ('${customerName}', '${location}', '${description}', '${dateOnsite}', '${dateLeaveSite}')
      `);
  } catch(err) {
    console.log(err);
  }
}

module.exports = { createActiveCustomers }