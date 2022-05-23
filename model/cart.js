const pool = require("../dbConnection");

//////////////////////// queries to create tables /////////////////////////
const CREATE_CARTS_TABLE = `
    CREATE TABLE carts (
        cartid SERIAL primary key,
        userid INT NOT NULL,
        productid INT NOT NULL,
        quantity INT NOT NULL
    )
`
const ALTER_CARTS_TABLE = `
    ALTER TABLE carts
    ADD FOREIGN KEY (userid) REFERENCES users(userid);
`

const ALTER_CARTSPRODUCTID_TABLE = `
    ALTER TABLE carts
    ADD FOREIGN KEY (productid) REFERENCES products(productid);
`

const DROP_CARTS_TABLE_SQL = `
    DROP TABLE IF EXISTS carts;
`
//////////////////////////////////////////////////////////////////////////

// to create cart table
module.exports.createCartsTable = function createCartsTable() {
    return pool.query(CREATE_CARTS_TABLE)
        .then(() => {
            console.log("Carts table created!");
        }).catch((err) => {
            console.log(err);
        })
};

// to alter cart table for userid fk
module.exports.alterCartsTable = function alterCartsTable() {
    return pool.query(ALTER_CARTSPRODUCTID_TABLE)
        .then(() => {
            console.log("Foreign key (Userid) in carts table added!");
        }).catch((err) => {
            console.log(err);
        })
};

// to alter cart table for productid fk
module.exports.alterCartsTableProductId = function alterCartsTableProductId() {
    return pool.query(ALTER_CARTS_TABLE)
        .then(() => {
            console.log("Foreign key (Productid) in carts table added!");
        }).catch((err) => {
            console.log(err);
        })
};

// delete carts table
module.exports.deleteCartsTable = function deleteCartsTable(){
    return pool.query(DROP_CARTS_TABLE_SQL)
        .then(() => {
            console.log("carts table deleted!");
        }).catch((err) => {
            console.log(err);
        })
};

// add a new cart item
module.exports.addCart = function addCart (userid, productid, quantity) {
    return pool.query(`INSERT INTO carts (userid, productid, quantity) VALUES($1, $2, $3)`, [userid, productid, quantity])
        .then((result) => result.rowCount)
        .catch((error) => {
            console.log(error);
        });
};

// get cart items by userid
module.exports.getAllCartsByUserId = function getAllCartsByUserId(userid) {
    return pool.query(`SELECT p.name, p.products_img_url, (p.price * c.quantity) AS total, u.username FROM ((carts c INNER JOIN products p ON p.productid=c.productid) INNER JOIN users u ON c.userid = u.userid) WHERE c.userid = $1`, [userid])
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// get specific cart item by cartid that belongs to a specific user
module.exports.getCartById = function getCartById(userid, cartid) {
    return pool.query(`select p.name, p.products_img_url, (p.price * c.quantity) AS total, u.username FROM ((carts c INNER JOIN products p ON p.productid=c.productid) INNER JOIN users u ON c.userid = u.userid) WHERE c.userid = $1 AND cartid = $2`, [userid, cartid])
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// delete one (1) cart item
module.exports.deleteCartItem = function deleteCartItem(userid, cartid) {
    return pool.query(`delete from carts where userid = $1 and cartid = $2`, [userid, cartid])
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// update one (1) product quantity in cart
module.exports.updateItemQuantity = function updateItemQuantity(userid, quantity) {
    return pool.query(`update carts set quantity = $2 WHERE userid = $1`, [userid, quantity])
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};