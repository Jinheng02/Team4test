// includes
const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const isLoggedInMiddleware = require("../auth/isLoggedInMiddleware");
const pool = require("../dbConnection");
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
    deleteProduct,
    alterProductTable
} = require("../model/product");

// for categories database
const { createCategoryTable, 
    addCategory, 
    deleteCategoryTable, 
    getCategory,
    getCategoryById,
    deleteCategoryById,
    updateCategory
} = require("../model/category");


// for cart database
const { addCart,
    createCartsTable,
    alterCartsTable,
    getAllCartsByUserId,
    updateItemQuantity,
    alterCartsTableProductId,
    deleteCartsTable,
    getCartById,
    deleteCartItem,
 } = require('../model/cart');


// for orders database
const { createOrdersTable, 
     deleteOrdersTable, 
     alterOrdersTable,
     alterOrdersProductIdTable,
     getOrders,
     getAllOrdersById,
     getOrderByOrderId,
     insertDataIntoOrders,
     deleteDataFromCart,
 } = require("../model/order");
//const { createProductTable, addProduct } = require("../model/product");


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
    const categoryid = req.body.categoryid;

    return addProduct(name, price, desc, categoryid)
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
    const categoryid = req.body.categoryid;
    const productid = req.params.id;
    
    return updateProduct(name, price, desc, categoryid, productid)
    .then(() => res.send(`Updated product successfully!`))
    .catch(next);
});

// delete product
app.delete('/products/:id', async (req, res, next) => {
    const productid = req.params.id;

    return deleteProduct(productid)
    .then(() => res.status(201).send(`Deleted product Successfully!`))
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
// THIS SECTION IS FOR THE CATEGORY DATABASE
///////////////////////////////////////////////

// to add new category to the categories database
app.post('/category', async (req, res, next) => {
    const categoryname = req.body.categoryname;

    return addCategory(categoryname)
    .then(() => res.status(201).send("New Category Inserted!"))
    .catch(next);
});

// to get category from database
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

// to update category table
app.put('/category/:id', async (req, res, next) => {
    const categoryid = req.params.id;
    const categoryname = req.body.categoryname;
    
    return updateCategory(categoryname, categoryid)
    .then(() => res.send(`Updated category successfully!`))
    .catch(next);
});

// delete category
app.delete('/category/:id', async (req, res, next) => {
    const categoryid = req.params.id;

    return deleteCategoryById(categoryid)
    .then(() => res.status(201).send(`Deleted category Successfully!`))
    .catch(next);
});

// delete category table
app.delete('/categoryTable', async (req, res, next) => {
    return deleteCategoryTable()
    .then(() => res.status(201).send(`Category table dropped!`))
    .catch(next);
});
//////////////////////////////////////////
// END OF SECTION FOR CATEGORY DATABASE
//////////////////////////////////////////



/////////////////////////////////////////////
// THIS SECTION IS FOR THE ORDERS DATABASE
/////////////////////////////////////////////

//get all orders from orders table
app.get('/orders', async (req, res, next) => {
    return getOrders()
    .then((results) => res.send(results))
    .catch(next);
});

//to retrieve order based on user's id
app.get('/users/:id/orders', async (req, res, next) => {
    const userid = req.params.id;

    return getAllOrdersById(userid)
    .then((results) => res.send(results))
    .catch(next);
});

//to retrieve order based on user's id and orderid
app.get('/users/:id/orders/:orderid', async (req, res, next) => {
    const userid = req.params.id;
    const orderid = req.params.orderid

    return getOrderByOrderId(userid, orderid)
    .then((results) => res.send(results))
    .catch(next);
});

// basically retrieve data from carts table and insert into orders table
app.post('/cart/:cartid/checkout', async (req, res, next) => {
    
    // retreive from the req body that is passed over
    const cartid = req.params.cartid;
    // const userid = req.params.id
    
    return insertDataIntoOrders(cartid)
    // .then(pool.query(`DELETE FROM carts WHERE cartid = ` + cartid))
    .then(() => res.status(201).send("Finished executing"))
    .catch(next);
});


app.delete('/cart/:cartid/checkout', async (req, res, next) => {
    
    // retreive from the req body that is passed over
    const cartid = req.params.cartid;
    
    return deleteDataFromCart(cartid)
    .then(() => res.status(201).send("Finished deleting from cart"))
    .catch(next);
});

//alter orders table to userid add Foreign Key
app.put('/ordersTableAlter', async (req, res, next) => {
    return alterOrdersTable()
    .then(() => res.status(201).send(`Order table altered!`))
    .catch(next);
});


//alter orders table to productid add Foreign Key
app.put('/ordersTableProductIdAlter', async (req, res, next) => {
    return alterOrdersProductIdTable()
    .then(() => res.status(201).send(`Order's productid altered!`))
    .catch(next);
});


//delete orders table
app.delete('/ordersTable', async (req, res, next) => {
    return deleteOrdersTable()
    .then(() => res.status(201).send(`Orders table dropped!`))
    .catch(next);
});


////////////////////////////////////////
// END OF SECTION FOR ORDERS DATABASE
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

// to add userid fk in carts table
app.put('/alterCartsTable', async (req, res, next) => {
    return alterCartsTable()
    .then(() => res.status(201).send("UserId FK created!"))
    .catch(next);
});

// to add productid fk in carts table
app.put('/alterCartsTableProductId', async (req, res, next) => {
    return alterCartsTableProductId()
    .then(() => res.status(201).send("ProductId FK created!"))
    .catch(next);
});

// delete carts table
app.delete('/cartsTable', async (req, res, next) => {
    return deleteCartsTable()
    .then(() => res.status(201).send("carts table dropped successfully!"))
    .catch(next);
});

// add a new cart item
app.post('/carts/:userid', async (req, res, next) => {

    const userid = req.params.userid;
    const productid = req.body.productid;
    const quantity = req.body.quantity;

    return addCart(userid, productid, quantity)
    .then((result) => res.status(201).send("New Cart Item Inserted with " + result + " row affected!"))
    .catch(next);
});

// get all cart items by userid
app.get('/carts/:userid', async (req, res, next) => {

    const userid = req.params.userid;

    return getAllCartsByUserId(userid)
    .then((result) => res.send(result))
    .catch(next);
});

// get specific cart item by cartid that belongs to a specific user
app.get('/users/:id/cart/:cartid', async (req, res, next) => {

    const userid = req.params.id;
    const cartid = req.params.cartid;

    return getCartById(userid, cartid)
    .then((result) => res.send(result))
    .catch(next);
});

// delete one (1) cart item that belongs to a specific user
app.delete('/carts/:userid', async (req, res, next) => {

    const userid = req.params.userid;
    const cartid = req.body.cartid;

    return deleteCartItem(userid, cartid)
    .then((result) => res.status(200).send("Cart Item Deleted with " + result + " affected!" ))
    .catch(next);
});


// to update a product qunatityt that belongs to a specific in the user's cart
app.put('/carts/:userid', async (req, res, next) => {

    const userid = req.params.userid;
    const quantity = req.body.quantity;

    return updateItemQuantity(userid, quantity)
    .then((result) => res.status(200).send("Cart Item Quantity updated with " + result + " affected!"))
    .catch(next);
});
////////////////////////////////////////
// END OF SECTION FOR CART DATABASE
////////////////////////////////////////
module.exports = app;