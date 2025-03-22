const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute.js");
const accountRoute = require('./routes/accountRoute.js');
const messageRoute = require('./routes/messageRoute.js');
const intentionalErrorRoute = require("./routes/intentionalErrorRoute.js");
const utilities = require("./utilities/index.js");
const pool = require("./database");

const app = express();
const env = require("dotenv").config();

const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser())
app.use(utilities.checkJWTToken);

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use(static);
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);
app.use("/message", messageRoute);
app.use("/ierror", intentionalErrorRoute);
app.use(async (req, res, next) => {
  next({status: 404, message: 'Unfortunately, we don\'t have that page in stock.'})
})

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  console.dir(err);
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});