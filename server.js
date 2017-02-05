const express = require('express');
const path = require('path');

const app = express();
const publicPath = path.join(__dirname, 'public');
const port = process.env.PORT || 8080;

app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
