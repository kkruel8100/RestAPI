const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(express.static('public'));

// Routes
// ===========================================================
require("./routes")(app);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, function () {
  console.log('App listening on PORT ' + PORT);
});
