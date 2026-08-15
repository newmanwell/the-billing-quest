const client = require("./client.cjs");

const createBilledCustomers = async(customerName, location, description, dateOnsite, dateLeaveSite, dateBilled) => {
  try {
    await client.query(`
      INSERT INTO billed_customers (customer_name, location, description, date_onsite, date_leave_site, date_billed)
      VALUES ('${customerName}', '${location}', '${description}', '${dateOnsite}', '${dateLeaveSite}', '${dateBilled}')
      `)
  } catch(err) {
    console.log(err);
  }
}

module.exports = { createBilledCustomers }