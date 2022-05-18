// includes
const express = require('express');
const cors = require('cors');
// for user database
const { createUserTable, addUser } = require("../model/user");
// for product database
const { createProductTable, addProduct, deleteProductTable, getProduct, getProductById } = require("../model/product");
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
    const productid = req.params.id

    return getProductById(productid)
    .then((results) => res.send(results))
    .catch(next);
});

// to update products table
// app.put('/product/:id', async (req, res, next) => {
//     return updateProductTable()
//     .then(() => res.status(201).send(`Product table dropped!`))
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

module.exports = app;