var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var indexRouter = require('./routes/index');
var categoryRouter = require('./routes/category');
var productRouter = require('./routes/product');
var usersRouter = require('./routes/users');
const pool = require('./routes/pool');
const upload = require('./routes/multer');
var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', categoryRouter);
// app.use('/product', productRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Create MySQL tables
const createTablesQuery = `
  CREATE TABLE weather_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(50) NOT NULL,
  fetch_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  weather_data JSON NOT NULL
);
`;


pool.query(createTablesQuery, (error) => {
  if (error) {
    console.error('Error creating tables:', error);
  } else {
    console.log('Tables ready');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;