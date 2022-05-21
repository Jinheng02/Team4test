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

// GET method
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

// GET method
// to retrive the data of a single user based on their id
app.get('/users/:id/', (req, res) => {
    // retrieve the id of the user we want to retrieve from the database
    var userid = req.params.id;
    User.getUserById(userid, (err, result) => {
        // if there is no error, send back the result 
        if (!err) {
            res.status(200).send(result);
        }
        // there is an error 
        else {
            // provide some json data msg to signify some error 
            res.status(500).send("{\"Result\":\"Internal Server Error\"}");
        }
    });
});

// POST method
// to add a new user into the database
app.post('/users/', (req, res) => {
    // retrieve from the req body msg the parameters that will be passing over
    var username = req.body.username;
    var fullname = req.body.fullname;
    var email = req.body.email;
    var password = req.body.password;
    var address = req.body.address;
    var role = req.body.role;

    // supply the 6 parameters retrieved by the caller of the web service
    User.addUser(username, fullname, email, password, address, role, (err, result) => {
        if (!err) {
            // send the result back to the user 
            res.status(201).send({"User added with these data": result});
        }
        // there is an error 
        else {
            // if statement to check whether the username or email provided already exist (check if there is any duplicates)
            // if error code = 23505, send the error result 
            if (err.code == "23505") {
                res.status(422).send("{\"Result\":\"username or email provided already exists\"}")
            }
            else {
                // else the error is unknown
                res.status(500).send("{\"Result\":\"Internal Server Error\"}")
            }
        }
    });
});

// PUT method
// to update a single user by the userid
app.put('/users/:id/', (req, res) => {
    // retrieve from the req body msg the parameters that will be passing over
    const username = req.body.username;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const address = req.body.address;
    const userid = req.params.id;

    // supply the 5 parameters retrieved by the caller of the web service
    User.updateUser(username, fullname, email, address, userid, (err, result) => {
        // if there is no error
        if (!err) {
            if (result == 0) {
                res.status(422).send("{\"Result\":\"New username or email provided already exists\"}")
            }
            else {
                // set status code, send result back
                res.status(200).send("User details updated with " + result + " row(s) affected");
            }
        }
        // there is an error 
        else {
            res.status(500).send("{\"Result\":\"Internal Server Error\"}")
        }
    });
});

// PUT method
// to rest user password by the userid in the database
app.put('/users/:id/resetPassword', (req, res) => {
    // retrieve from the req body msg the parameters that will be passing over
    const password = req.body.password;
    const userid = req.params.id;

    // supply the 5 parameters retrieved by the caller of the web service
    User.updateUserPw(password, userid, (err, result) => {
        // if there is no error
        if (!err) {
            // set status code, send result back
            res.status(200).send("User password is updated successfully with " + result + " row affected");
        }
        // there is an error 
        else {
            res.status(500).send("{\"Result\":\"Internal Server Error\"}")
        }
    });
});

// DELETE method 
// to delete a user by its userid in the database
app.delete('/users/:id', async (req, res, next) => {
    // retrieve from the req body msg the parameters that will be passing over
    const userid = req.params.id;

    // supply the 1 parameter retrieved by the caller of the web service
    User.deleteUser(userid)
    .then(() => res.status(200).send("User is successfully deleted"))
    .catch(next);
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