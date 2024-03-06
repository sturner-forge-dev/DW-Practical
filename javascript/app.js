var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("hbs");
var dotenv = require("dotenv");

var indexRouter = require("./routes/index");
dotenv.config({ path: "config.env" });

var app = express();

hbs.registerHelper("isEqual", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper("capitalizeFirstLetters", function (str) {
  return String(str)
    .toLowerCase()
    .split(/[\s-]/) // split by spaces and hyphens
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(/ - /g, "-"); // join hyphenated words back together
});

hbs.registerHelper("formatDate", function (dateStr) {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
});

hbs.registerHelper("boolToYesNo", function (bool) {
  return bool ? "Yes" : "No";
});

hbs.registerHelper("or", function () {
  var args = Array.prototype.slice.call(arguments, 0, -1);
  return args.some(Boolean);
});

// view engine setup
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
