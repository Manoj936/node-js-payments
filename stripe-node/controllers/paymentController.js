const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;

const stripe = require('stripe')(STRIPE_SECRET_KEY)

const renderBuyPage = async(req,res)=>{

    try {
        
        res.render('buy', {
            key: STRIPE_PUBLISHABLE_KEY,
            amount:25
         })

    } catch (error) {
        console.log(error.message);
    }

}

const payment = async(req,res)=>{

    try {

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Manoj M',
        address: {
            line1: '717, Oldtown',
            postal_code: '751005',
            city: 'Bhubaneswar',
            state: 'Odisha',
            country: 'India',
        }
    })
    .then((customer) => {
 
        return stripe.charges.create({
            amount: req.body.amount,     // amount should be amount*100
            description: req.body.productName,
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge) => {
        console.log(charge , "🏳️🏳️🏳️🏳️")
        res.redirect("/success")
    })
    .catch((err) => {
        console.log(err , "🚩🚩🚩🚩")
        res.redirect("/failure")
    });


    } catch (error) {
        console.log(error.message);
    }

}

const success = async(req,res)=>{

    try {
        
        res.render('success');

    } catch (error) {
        console.log(error.message);
    }

}

const failure = async(req,res)=>{

    try {
        
        res.render('failure');

    } catch (error) {
        console.log(error.message);
    }

}

const createCustomer = async(req,res)=>{

    try {

        const customer = await stripe.customers.create({
            name:req.body.name,
            email:req.body.email,
        });

        res.status(200).send(customer);

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}

const addNewCard = async(req,res)=>{

    try {

        const {
            customer_id,
            card_Name,
            card_ExpYear,
            card_ExpMonth,
            card_Number,
            card_CVC,
        } = req.body;

        const card_token = await stripe.tokens.create({
            card:{
                name: card_Name,
                number: card_Number,
                exp_year: card_ExpYear,
                exp_month: card_ExpMonth,
                cvc: card_CVC
            }
        });

        const card = await stripe.customers.createSource(customer_id, {
            source: `${card_token.id}`
        });
        
        res.status(200).send({ card: card.id }); 

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}

const createCharges = async(req,res)=>{

    try {

        const createCharge = await stripe.charges.create({
            receipt_email: 'tester@gmail.com',
            amount: parseInt(req.body.amount)*100, //amount*100
            currency:'INR',
            card: req.body.card_id,  //card is should be fetched from the saved cards
            customer: req.body.customer_id //customer_id is the stripe created customer id 
        });

        res.status(200).send(createCharge);

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}


module.exports = {
    renderBuyPage,
    payment,
    success,
    failure,
    createCustomer,
    addNewCard,
    createCharges
}