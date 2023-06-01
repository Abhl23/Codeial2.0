const express = require("express");

const port = 8000;

const app = express();

// use express router
app.use('/', require('./routes'));

// set the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
    return;
  }

  console.log(`Server is up and running on port: ${port}`);
});
