var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

mongoose.connect(`${process.env.MONGO_URI}`).then(() => {
// mongoose.connect(`mongodb+srv://${process.env.DB_LOGIN}:<${process.env.DB_PASSWORD}>@cluster0.u1lznhl.mongodb.net/`).then(() => {
    console.log('connected to MongoDB')
}).catch((error) => {
    console.log(error);
});

module.exports = app;
