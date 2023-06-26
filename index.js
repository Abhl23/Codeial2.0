const express = require("express");
const env = require("./config/environment");
const logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./config/mongoose");

// used for session cookie
const session = require("express-session");

const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");

const MongoStore = require("connect-mongo");

const sassMiddleware = require("node-sass-middleware");

const flash = require("connect-flash");
const customMware = require("./config/middleware");

const port = 8000;

const app = express();

// setup the chat server to be used with socket.io
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log(`Chat Server is listening on port ${5000}`);

const path = require("path");

// should only run in development mode
if (env.name == "development") {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.assets_path, "scss"),
      dest: path.join(__dirname, env.assets_path, "css"),
      outputStyle: "extended",
      debug: true,
      prefix: "/css",
    })
  );
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// use static files
app.use(express.static(env.assets_path));
// make the uploads path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

// setup the logger
app.use(logger(env.morgan.mode, env.morgan.options));

// use express layouts
app.use(expressLayouts);
// extract styles and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// set the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "codeial",
    // change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/codeial_development",
      autoRemove: "disabled",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
    return;
  }

  console.log(`Server is up and running on port: ${port}`);
});
