const pool = require("../dbConnection");

//////////////////////// queries to create tables /////////////////////////
const CREATE_CARTS_TABLE = `
create table carts (
    cartid serial primary key
    )
`
const ALTER_CARTS_TABLE = `
alter table carts
add foreign key (userid) references users (userid)
`

const CREATE_CART_ITEM_TABLE = `
CREATE TABLE cartItem (
    id SERIAL primary key,
    cart_id    ??????,
    product_id  ?????,
    quantity INT(4) NOT NULL
)`

// To create cart table
module.exports.createCartsTable = function createCartsTable() {
    return pool.query(CREATE_CARTS_TABLE)
        .then(() => {
            console.log("Carts table created!");
        }).catch((err) => {
            console.log(err);
        })
};

// To create cart table
module.exports.alterCartsTable = function alterCartsTable() {
    return pool.query(ALTER_CARTS_TABLE)
        .then(() => {
            console.log("Foreign key in carts table added!");
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