# The Billing Quest

My team often operates independently from other departments in the company. We needed a solution to keep track of the customers we are working on so that we ultimately bill them for our services. This app I'm building is to keep track of our customers. "Active Customers" are any customers that we havent billed yet (pre-work, on-site). Billed customers is just that, work is completed and we have billed them.  

* PostgreSQL for the DB
* Express for the middleware
* React with TypeScript frontend
* Claude Code for Agentic work

While I've used AI to help with design, syntax help, and code reviews before this project I am letting Claude do a good amount of the heavy lifting. I am making Claude code the way I code, small testable chunks before moving onto the next task.  

I'm pretty excited to build an app that will be used in a real work enviroment!

## To Run Locally
1. Install dependencies: 
    1. npm install express
    2. npm install pg
    3. npm install nodemon
2. In PSQL: CREATE DATABASE billingquest;
3. To seed tables and inital test customer rows: node db/seed.cjs
4. To start server: node server.cjs or nodemon server.cjs
5. To start frontend dev environment: npm run dev