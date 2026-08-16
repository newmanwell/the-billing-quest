const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
  res.send('Billing Quest Server');
})

app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
})

app.use((err, req, res, next) => {
  res.status(500).send(err);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});