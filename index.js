const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
//const logger = require('morgan');
const app = express();
const port = 5000;
//app.use(logger('dev'))

var fs = require('fs')
var morgan = require('morgan')
var path = require('path')
 
 
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
 
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))
 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const {
  USER_API_URL,
  ADMIN_API_URL,
  UPI_API_URL,
  NEFT_API_URL,
  IMPS_API_URL
 
} = require('./URLs');

const optionsUsers = {
  target: USER_API_URL,
  changeOrigin: true, 
  logger: console,
};

const optionsAdmin = {
  target: ADMIN_API_URL,
  changeOrigin: true, 
  logger: console,
};

const optionsUpi = {
  target: UPI_API_URL,
  changeOrigin: true, 
  logger: console,
};
const optionsNeft = {
  target: NEFT_API_URL,
  changeOrigin: true, 
  logger: console,
};
const optionsImps = {
  target: IMPS_API_URL,
  changeOrigin: true, 
  logger: console,
};
const usersProxy = createProxyMiddleware(optionsUsers);
const adminProxy = createProxyMiddleware(optionsAdmin);
const upiProxy = createProxyMiddleware(optionsUpi);
const neftProxy = createProxyMiddleware(optionsNeft);
const impsProxy = createProxyMiddleware(optionsImps);

app.get('/', (req, res) => res.send('Hello Gateway API'));

//admin 2
app.post('/admin/signin', adminProxy);
app.post('/admin/signup', adminProxy);

//user 10
app.post('/users/signup', usersProxy);
app.post('/users/signin', usersProxy);
app.get('/users/admin/data', usersProxy);//admin
app.get('/users/data/:id', usersProxy);
app.get('/users/dataupi/:upi', usersProxy);
app.put('/users/addmoney/:id', usersProxy);
app.put('/users/changeprofile/:id', usersProxy);
app.put('/users/changebyupi/:upi', usersProxy);
app.put('/users/changebyneft/:upi', usersProxy);
app.delete('/users/admin/user/:id', usersProxy);//admin

//upi 4
app.post('/upi/upitransfer', upiProxy);
app.delete('/upi/admin/upitransfer/:id', upiProxy);//admin
app.get('/upi/admin/history', upiProxy);//admin
app.get('/upi/upitransfer/:id', upiProxy);


//neft 4
app.post('/neft/nefttransfer', neftProxy);
app.delete('/neft/admin/nefttransfer/:id', neftProxy);//admin
app.get('/neft/admin/history', neftProxy);//admin
app.get('/neft/nefttransfer/:id', neftProxy);

//imps 4
app.post('/imps/impstransfer', impsProxy);
app.delete('/imps/admin/impstransfer/:id', impsProxy);//admin
app.get('/imps/admin/history', impsProxy);//admin
app.get('/imps/impstransfer/:id', impsProxy);


app.listen(port, () => console.log(` app listening on port ${port}!`));