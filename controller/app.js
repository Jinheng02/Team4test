// includes
const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const isLoggedInMiddleware = require("../auth/isLoggedInMiddleware");
// for user database
const { createUsersTable, dropUsersTable } = require("../model/user");
const User = require("../model/user");
// for product database
const { createProductTable, 
    addProduct, 
    deleteProductTable, 
    getProduct, 
    getProductById, 
    updateProduct,
    alterProductTable
} = require("../model/product");

// for categories database
const { createCategoryTable, 
    addCategory, 
    deleteCategoryTable, 
    getCategory,
    getCategoryById
} = require("../model/category");


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

// to create the categories table
app.post('/categoryTable', async (req, res, next) => {
    return createCategoryTable()
    .then(() => res.status(201).send("Category table created!"))
    .catch(next);
});

// to create the orders table
app.post('/ordersTable', async (req, res, next) => {
    return createOrdersTable()
    .then(() => res.status(201).send("Orders table created!"))
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
    var role = req.body.role;

    // supply the 5 parameters retrieved by the caller of the web service
    User.addUser(username, fullname, email, password, role, (err, result) => {
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
// to add user address into the database
// added isLoggedInMiddleware to secure the endpoint (authentication)
// tested this
app.put('/users/:id/address', isLoggedInMiddleware, (req, res) => {
    const userid = parseInt(req.params.id);
    if (isNaN(userid)) {
        res.status(400).send();
    }
    // if userid in decoded token do not match the userid in the request params
    // send 403 forbidden (server understand but refuse to authorize -- authorization)
    if (userid !== req.decodedToken.userid) {
        res.status(403).send();
        return;
    }
    // retrieve from the req body msg the parameters that will be passing over
    var address = req.body.address;

    // supply the 2 parameters retrieved by the caller of the web service
    User.addUserAddress(address, userid, (err, result) => {
        if (!err) {
            // send the result back to the user 
            res.status(200).send({"User address added with these data": result});
        }
        // there is an error 
        else {
            res.status(500).send("{\"Result\":\"Internal Server Error\"}")
        }
    });
});

// PUT method
// to update a single user by the userid
// added isLoggedInMiddleware to secure the endpoint (authentication)
// tested this
app.put('/users/:id/', isLoggedInMiddleware, (req, res) => {
    const userid = parseInt(req.params.id);
    if (isNaN(userid)) {
        res.status(400).send();
    }
    // if userid in decoded token do not match the userid in the request params
    // send 403 forbidden (server understand but refuse to authorize -- authorization)
    if (userid !== req.decodedToken.userid) {
        res.status(403).send();
        return;
    }
    // retrieve from the req body msg the parameters that will be passing over
    const username = req.body.username;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const address = req.body.address;
    

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
// added isLoggedInMiddleware to secure the endpoint (authentication)
// tested this
app.put('/users/:id/resetPassword', isLoggedInMiddleware, (req, res) => {
    const userid = parseInt(req.params.id);
    if (isNaN(userid)) {
        res.status(400).send();
    }
    // if userid in decoded token do not match the userid in the request params
    // send 403 forbidden (server understand but refuse to authorize -- authorization)
    if (userid !== req.decodedToken.userid) {
        res.status(403).send();
        return;
    }
    // retrieve from the req body msg the parameters that will be passing over
    const password = req.body.password;

    // supply the 5 parameters retrieved by the caller of the web service
    User.updateUserPw(password, userid, (err, result) => {
        // if there is no error
        if (!err) {
            // set status code, send result back
            res.status(200).send("User password is updated successfully with " + result + " row affected");
        }
        // there is an error 
        else {
            res.status(500).send("{\"Result\":\"Internal Server Error\"}");
        }
    });
});

// DELETE method 
// to delete a user by its userid in the database
// added isLoggedInMiddleware to secure the endpoint (authentication)
// tested this
app.delete('/users/:id', isLoggedInMiddleware, async (req, res, next) => {
    const userid = parseInt(req.params.id);
    if (isNaN(userid)) {
        res.status(400).send();
    }
    // if userid in decoded token do not match the userid in the request params
    // send 403 forbidden (server understand but refuse to authorize -- authorization)
    if (userid !== req.decodedToken.userid) {
        res.status(403).send();
        return;
    }
    // retrieve from the req body msg the parameters that will be passing over

    // supply the 1 parameter retrieved by the caller of the web service
    User.deleteUser(userid)
    .then(() => res.status(200).send("User is successfully deleted"))
    .catch(next);
});

// POST method
// for login of user
app.post('/login/', (req, res) => {
    // retrieve from the req body msg the parameters that will be passing over
    var username = req.body.username;
    var password = req.body.password;

    // supply the 2 parameter retrieved by the caller of the web service
    User.verifyUser(username, password, (error, result) => {
        // there is an error
        if (error) {
            res.status(500).send("{\"Result\":\"Internal Server Error\"}");
        }
        // if there is no user result returned
        if (result == null) {
            res.status(401).send();
        }
        const payload = { userid: result.userid, role: result.role };
        jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" }, (error, token) => {
            // error
            // send 401 unauthorized when the login fails
            if (error) {
                res.status(401).send();
                return;
            }
            // else send the JWT and the userid
            res.status(200).send({ token: token, userid: result.userid, role: result.role });
        });
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

// to get product by id from database
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

// alter products table
// app.post('/productTableAlter', async (req, res, next) => {
//     return alterProductTable()
//     .then(() => res.status(201).send(`Product table altered!`))
//     .catch(next);
// });

// delete products table
app.delete('/productTable', async (req, res, next) => {
    return deleteProductTable()
    .then(() => res.status(201).send(`Product table dropped!`))
    .catch(next);
});
////////////////////////////////////////
// END OF SECTION FOR PRODUCTS DATABASE
////////////////////////////////////////



///////////////////////////////////////////////
// THIS SECTION IS FOR THE CATEGORIES DATABASE
///////////////////////////////////////////////

// to add new category to the categories database
app.post('/category', async (req, res, next) => {
    const categoryName = req.body.categoryName;

    return addCategory(categoryName)
    .then(() => res.status(201).send("New Category Inserted!"))
    .catch(next);
});

// to get categories from database
app.get('/category', async (req, res, next) => {
    return getCategory()
    .then((results) => res.send(results))
    .catch(next);
});

// to get category from database
app.get('/category/:id', async (req, res, next) => {
    const categoryid = req.params.id;

    return getCategoryById(categoryid)
    .then((results) => res.send(results))
    .catch(next);
});

// to update products table
// app.put('/products/:id', async (req, res, next) => {
//     const name = req.body.name;
//     const price = req.body.price;
//     const desc = req.body.desc;
//     const image_url = req.body.image_url;
//     const category_id = req.body.category_id;
//     const productid = req.params.id;
    
//     return updateProduct(name, price, desc, image_url, category_id, productid)
//     .then(() => res.send(`Updated product successfully!`))
//     .catch(next);
// });

// delete products table
app.delete('/categoryTable', async (req, res, next) => {
    return deleteCategoryTable()
    .then(() => res.status(201).send(`Category table dropped!`))
    .catch(next);
});
//////////////////////////////////////////
// END OF SECTION FOR CATEGORIES DATABASE
//////////////////////////////////////////



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