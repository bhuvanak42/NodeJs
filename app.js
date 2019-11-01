//HANDLING REQUESTS
const express = require('express');
const app = express();

//log or funnel all incoming request through morgan 
// morgan internally calls next function 
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');

const bodyParser = require('body-parser');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://bhuvana_admin:bhuvana@nodejsmongodb-6ku1e.mongodb.net/test?retryWrites=true`, {
	useNewUrlParser: true	
}, (err) => {
	if(err) {
		console.log("Error occured while connecting to DB \n" + err);
	}
	else
	console.log("Connection established with MongoDB");
});

mongoose.Promise = global.Promise;

//app.use(morgan('dev'));

// create a rotating write stream
var accessLogStream = rfs('access.log', {
	interval: '1d', // rotate daily
	path: path.join(__dirname, 'log')
  })
  


// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Acces-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","Origin, X-Requeted-With,Content-Type, Accept, Authorization");

	if(res.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods','PUT, POST,GET, PATCH, DELETE');
		res.status(200).json({});
	}
	next();
});

//SET UP MIDDLEWARE
//routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/uploads',express.static('uploads'));

app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;