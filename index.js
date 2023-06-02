const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./config/mongoose");

const port = 8000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// use static files
app.use(express.static("./assets"));
// extract styles and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// use express layouts
app.use(expressLayouts);

// use express router
app.use("/", require("./routes"));

// set the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
    return;
  }

  console.log(`Server is up and running on port: ${port}`);
});
