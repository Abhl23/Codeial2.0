const development = {
  name: "development",
  assets_path: "/assets",
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
};

const production = {
  name: "production",
};

module.exports = development;
