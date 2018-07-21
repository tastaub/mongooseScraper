
const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require("body-parser");
const path = require('path');
const logger = require('morgan');
const mongoose = require("mongoose");


const app = express();
const PORT = process.env.PORT || 8080;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraperData"
mongoose.connect(MONGODB_URI)
const db = mongoose.connection

db.on('error', err => console.log(`Mongoose connection error: ${err}`))
// view engine setup
db.once('open', () => console.log(`Connected to MongoDB`))
 
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./routes/index')
app.use('/', routes)



app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

