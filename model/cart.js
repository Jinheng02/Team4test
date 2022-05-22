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

// To create cart table
module.exports.createCartsTable = function createCartsTable() {
    return pool.query(CREATE_CARTS_TABLE)
        .then(() => {
            console.log("Carts table created!");
        }).catch((err) => {
            console.log(err);
        })
};

// To alter cart table for fk
module.exports.alterCartsTable = function alterCartsTable() {
    return pool.query(ALTER_CARTSPRODUCTID_TABLE)
        .then(() => {
            console.log("Foreign key (Userid) in carts table added!");
        }).catch((err) => {
            console.log(err);
        })
};

// To alter cart table for fk
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

// Add new cart
module.exports.newCart = function newCart(cartid, userid, productid, quantity) {
    return pool.query(`INSERT INTO cart (cartid, userid, productid, quantity) VALUES($1, $2, $3, $4) RETURNING *`, [cartid, userid, productid, quantity])
        .then(() => console.log("Records Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};

// get cart items by userid
module.exports.getCartByUserId = function getCart() {
    return pool.query(`select productid, quantity from carts`)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// Add item into cart
module.exports.addCartItem = function addCartItem(cartid, userid, productid, quantity) {
    return pool.query(`INSERT INTO carts (userid, productid, quantity) VALUES($1, $2, $3) RETURNING *`, [userid, productid, quantity])
        .then(() => console.log("Records Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};

// update product quantity in cart
module.exports.updateQuantity = function updateQuantity(cartid, userid, productid, quantity) {
    return pool.query(`update carts set quantity = $1 WHERE userid = $2  RETURNING address, userid`, [cartid, userid, productid, quantity])
        .then(() => console.log("quantity updated!"))
        .catch((error) => {
            console.log(error);
        });
};