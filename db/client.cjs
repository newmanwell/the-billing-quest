const { Client } = require('pg');
const client = new Client('pstgres://localhost:5432/billingquest');

module.exports = client;