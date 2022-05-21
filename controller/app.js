// includes
const express = require('express');
const cors = require('cors');
// for user database
const { createUsersTable, dropUsersTable } = require("../model/user");
const User = require("../model/user");
// for product database
const { createProductTable, 
    addProduct, 
    deleteProductTable, 
    getProduct, 
    getProductById , 
    updateProduct
} = require("../model/product");


// for cart database
const { createCartTable } = require('../model/cart');

// for orders database
const { createOrdersTable, addOrder } = require("../model/order");
const { addCartItem } = require('../model/cart');
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
    return createUsersTable()
    .then(() => res.status(201).send("Users table created!"))
    .catch(next);
});

// to create the products table
app.post('/productTable', async (req, res, next) => {
    return createProductTable()
    .then(() => res.status(201).send("Product table created!"))
    .catch(next);
});

// to create the orders table
app.post('/ordersTable', async (req, res, next) => {
    return createOrdersTable()
    .then(() => res.status(201).send("Product table created!"))
    .catch(next);
});

///////////////////////////////////////////////////
// END OF SECTION TO CREATE TABLES IN THE DATABASE
///////////////////////////////////////////////////

//////////////////////////////////////////
// THIS SECTION IS FOR THE USERS DATABASE
/////////////////////////////////////////

// to get all users in the database
app.get('/users/', (req, res) => {
    // retrieve users from the database
    User.getUsers((error, result) => {
        // if there is no error, send back the result
        if (!error) {
            res.status(200).send(result);
        }
        // there is an error
        else {
            res.status(500).send("{\"Result\":\"Internal Server Error\"}");
        }
    });
});

// DELETE method
// to drop the user table in the database
app.delete('/userTable', async (req, res, next) => {
    return dropUsersTable()
    .then(() => res.status(201).send("Test table dropped successfully!"))
    .catch(next);
});


/////////////////////////////////////
// END OF SECTION FOR USERS DATABASE
/////////////////////////////////////






/////////////////////////////////////////////
// THIS SECTION IS FOR THE PRODUCTS DATABASE
/////////////////////////////////////////////

// to add new product to the products database
app.post('/products', async (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const desc = req.body.desc;
    const image_url = req.body.image_url;
    const category_id = req.body.category_id;

    return addProduct(name, price, desc, image_url, category_id)
    .then(() => res.status(201).send("New Product Inserted!"))
    .catch(next);
});

// to get products from database
app.get('/products', async (req, res, next) => {
    return getProduct()
    .then((results) => res.send(results))
    .catch(next);
});

// to get products from database
app.get('/products/:id', async (req, res, next) => {
    const productid = req.params.id;

    return getProductById(productid)
    .then((results) => res.send(results))
    .catch(next);
});

// to update products table
app.put('/products/:id', async (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const desc = req.body.desc;
    const image_url = req.body.image_url;
    const category_id = req.body.category_id;
    const productid = req.params.id;
    
    return updateProduct(name, price, desc, image_url, category_id, productid)
    .then(() => res.send(`Updated product successfully!`))
    .catch(next);
});

// delete products table
app.delete('/productTable', async (req, res, next) => {
    return deleteProductTable()
    .then(() => res.status(201).send(`Product table dropped!`))
    .catch(next);
});
////////////////////////////////////////
// END OF SECTION FOR PRODUCTS DATABASE
////////////////////////////////////////

/////////////////////////////////////////////
// THIS SECTION IS FOR THE ORDERS DATABASE
/////////////////////////////////////////////

//add new order to the orders table
app.post('/newOrder', async (req, res, next) => {
    const amount = req.body.amount;
    const total = req.body.total;
    const paymentMethod = req.body.paymentMethod;
    const ref = req.body.ref; 

    return addOrder(user_id, amount, total, paymentMethod, checkout_status, ref)
    .then(() => res.status(201).send("New Records Inserted!"))
    .catch(next);
});

////////////////////////////////////////
// END OF SECTION FOR ORDERS DATABASE
////////////////////////////////////////



////////////////////////////////////////
// THIS SECTION IS FOR THE CART DATABASE
////////////////////////////////////////

app.post('/cart/cart_item', async (req, res, next) => {
    const id = req.body.id;
    const cart_id = req.body.cart_id;
    const product_id = req.body.product_id;
    const quantity = req.body.quantity;

    return addCartItem(id, cart_id, product_id, quantity)
    .then(() => res.status(201).send("New Cart item Inserted!"))
    .catch(next);
});

// to add new cart
app.post('/cartTable', async (req, res, next) => {
    return createCartTable()
    .then(() => res.status(201).send("Cart table created!"))
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
////////////////////////////////////////
// END OF SECTION FOR CART DATABASE
////////////////////////////////////////
module.exports = app;