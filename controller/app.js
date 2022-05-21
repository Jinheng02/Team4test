// includes
const express = require('express');
const cors = require('cors');
// for user database
const { createUserTable, addUser } = require("../model/user");
// for product database
const { createProductTable, addProduct } = require("../model/product");
const { addCartItem, createCartsTable } = require('../model/cart');
// to display what port is server running on
const PORT = process.env.PORT || 3000;

// initialize
const app = express();

// allow for cross-origin and json
app.use(cors());
app.use(express.json());

// basic route
// to test whether server is running
app.get('/',(req, res)=> {
    res.send(`<h1>Server running on port ${PORT}</h1> <h3>Version 1.1</h3>`)
});

////////////////////////////////////////////////////////
// THIS SECTION IS USED FOR CREATING TABLES IN DATABASE
////////////////////////////////////////////////////////

// to create the user table
app.post('/userTable', async (req, res, next) => {
    return createUserTable()
    .then(() => res.status(201).send("User table created!"))
    .catch(next);
});

// to create the products table
app.post('/productTable', async (req, res, next) => {
    return createProductTable()
    .then(() => res.status(201).send("Product table created!"))
    .catch(next);
});

///////////////////////////////////////////////////
// END OF SECTION TO CREATE TABLES IN THE DATABASE
///////////////////////////////////////////////////


//////////////////////////////////////////
// THIS SECTION IS FOR THE USERS DATABASE
/////////////////////////////////////////

// to add new user to the database
app.post('/newUser', async (req, res, next) => {
    const email = req.body.email;
    const fullname = req.body.fullname;

    return addUser(email, fullname)
    .then(() => res.status(201).send("New User Inserted Successfully!"))
    .catch(next);
});

// to add new cart
app.post('/users/cart', async (req, res, next) => {
    const cart_id = req.body.cart_id;
    const user_id = req.body.user_id;

    return addCart(cart_id, user_id)
    .then(() => res.status(201).send("New Records Inserted!"))
    .catch(next);
});

// new cart item 
app.post('/users/cart/cartitem', async (req, res, next) => {
    const id = req.body.id;
    const cart_id = req.body.cart_id;
    const product_id = req.body.product_id;
    const quantity = req.body.quantity;

    return addCartItem(id, cart_id, product_id, quantity)
    .then(() => res.status(201).send("New Records Inserted!"))
    .catch(next);
});
/////////////////////////////////////
// END OF SECTION FOR USERS DATABASE
/////////////////////////////////////


/////////////////////////////////////////////
// THIS SECTION IS FOR THE PRODUCTS DATABASE
/////////////////////////////////////////////

// to add new product to the products database
app.post('/product', async (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const desc = req.body.desc;

    return addProduct(name, price, desc)
    .then(() => res.status(201).send("New Records Inserted!"))
    .catch(next);
});
////////////////////////////////////////
// END OF SECTION FOR PRODUCTS DATABASE
////////////////////////////////////////


////////////////////////////////////////
// THIS SECTION IS FOR THE CART DATABASE
////////////////////////////////////////

// to add carts table
app.post('/cartsTable', async (req, res, next) => {
    return createCartsTable()
    .then(() => res.status(201).send("Carts table created!"))
    .catch(next);
});


// new cart item 
app.post('/cart/:cartItem', async (req, res, next) => {
    const id = req.body.id;
    const cart_id = req.body.cart_id;
    const product_id = req.body.product_id;
    const quantity = req.body.quantity;

    return addCartItem(id, cart_id, product_id, quantity)
    .then(() => res.status(201).send("New Records Inserted!"))
    .catch(next);
});

////////////////////////////////////////
// END OF SECTION FOR CART DATABASE
////////////////////////////////////////
module.exports = app;