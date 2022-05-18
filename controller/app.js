// includes
const express = require('express');
const cors = require('cors');
// for user database
const { createUsersTable, addUser, updateUser, updateUserPw, getUserById, deleteUser, dropUsersTable } = require("../model/user");
// for product database
const { createProductTable, 
    addProduct, 
    deleteProductTable, 
    getProduct, 
    getProductById , 
    updateProduct
} = require("../model/product");

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
///////////////////////////////////////////////////
// END OF SECTION TO CREATE TABLES IN THE DATABASE
///////////////////////////////////////////////////



//////////////////////////////////////////
// THIS SECTION IS FOR THE USERS DATABASE
/////////////////////////////////////////

// POST method
// to add new user to the database
app.post('/newUser', async (req, res, next) => {
    // retrieve from the req body msg the parameters that will be passing over
    const username = req.body.username;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address;
    const role = req.body.role;

    // supply the 6 parameters retrieved by the caller of the web service
    return addUser(username, fullname, email, password, address, role)
    .then((result) => res.status(201).json(result))
    .catch(next);
});

// PUT method
// to update user by its userid in the database
app.put('/users/:id', async (req, res, next) => {
    // retrieve from the req body msg the parameters that will be passing over
    const username = req.body.username;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const address = req.body.address;
    const userid = req.params.id;

    // supply the 5 parameters retrieved by the caller of the web service
    return updateUser(username, fullname, email, address, userid)
    .then((result) => res.status(201).json(result))
    .catch(next);
});

// PUT method
// to rest user password by its userid in the database
app.put('/users/:id/resetPassword', async (req, res, next) => {
    // retrieve from the req body msg the parameters that will be passing over
    const password = req.body.password;
    const userid = req.params.id;

    // supply the 2 parameters retrieved by the caller of the web service
    return updateUserPw(password, userid)
    .then(() => res.status(200).send("Password has been reset successfully!"))
    .catch(next);
});

// GET method
// to get a user by its userid from the database
app.get('/users/:id', async (req, res, next) => {
    const userid = req.params.id;

    // supply the 1 parameter retrieved by the caller of the web service
    return getUserById(userid)
    .then((results) => res.status(200).send(results))
    .catch(next);
});

// DELETE method 
// to delete a user by its userid in the database
app.delete('/users/:id', async (req, res, next) => {
    // retrieve from the req body msg the parameters that will be passing over
    const userid = req.params.id;

    // supply the 1 parameter retrieved by the caller of the web service
    return deleteUser(userid)
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

module.exports = app;