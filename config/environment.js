const fs = require("fs");
const path = require("path");
const rfs = require("rotating-file-stream");

// path where the log files will be stored
const logDirectory = path.join(__dirname, "../production_logs");
// creates the log directory if it does not exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: logDirectory,
});

const development = {
  name: "development",
  assets_path: "./assets",
  session_cookie_key: "blahsomething",
  db: "codeial_development",
  smtp: {
    service: "gmail",
    host: "smtp.google.com",
    port: 587,
    secure: false,
    auth: {
      user: "codeial.updates@gmail.com",
      pass: "wahjbbowvvxqkclo",
    },
  },
  google_client_id:
    "472497485199-pn5tuecdo07qi24t9oqq3shrcpe2lvpe.apps.googleusercontent.com",
  google_client_secret: "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",
  google_callback_url: "http://localhost:8000/users/auth/google/callback",
  jwt_secret: "codeial",
  morgan: {
    mode: "dev",
    options: { stream: accessLogStream },
  },
};

const production = {
  name: "production",
  assets_path: process.env.CODEIAL_ASSETS_PATH,
  session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
  db: process.env.CODEIAL_DB,
  smtp: {
    service: "gmail",
    host: "smtp.google.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.CODEIAL_GMAIL_USERNAME,
      pass: process.env.CODEIAL_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
  google_callback_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.CODEIAL_JWT_SECRET,
  morgan: {
    mode: "combined",
    options: { stream: accessLogStream },
  },
};

module.exports =
  eval(process.env.NODE_ENV) == undefined
    ? development
    : eval(process.env.NODE_ENV);

// module.exports =
//   eval(process.env.CODEIAL_ENVIRONMENT) == undefined
//     ? development
//     : eval(process.env.CODEIAL_ENVIRONMENT);
