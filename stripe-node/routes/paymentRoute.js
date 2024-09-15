const express = require('express');
const payment_route = express();

const bodyParser = require('body-parser');
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended:false }));

const path = require('path');

payment_route.set('view engine','ejs');
payment_route.set('views',path.join(__dirname, '../views'));

const paymentController = require('../controllers/paymentController');


// Render the initial dummy product page
payment_route.get('/', paymentController.renderBuyPage);

//Handle the form submit 
payment_route.post('/payment', paymentController.payment);

//Render the success page
payment_route.get('/success', paymentController.success);

//Render the failure page
payment_route.get('/failure', paymentController.failure);

//Create a customer in strite in order to save the customer id in user collection (if any) for future payments
payment_route.post('/create-customer', paymentController.createCustomer);

//Create a new payment card (can be saved as different cards for a single user)
payment_route.post('/add-card', paymentController.addNewCard);

//Create a payment using customerId and cardId
payment_route.post('/create-charges', paymentController.createCharges);

module.exports = payment_route;