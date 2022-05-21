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
module.exports.newCart = function newCart(cart_id, user_id) {
    return pool.query(`INSERT INTO cart (cart_id, user_id) VALUES($1, $2) RETURNING *`, [cart_id, user_id])
        .then(() => console.log("Records Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};


/////////////////////// CART ITEM ////////////////////////
// create cart item table
module.exports.createCartItemTable = function createCartItemTable() {
    return pool.query(CREATE_CART_ITEM_TABLE)
        .then(() => {app.post('/users/cart/cartitem', async (req, res, next) => {
            const cart_id = req.body.cart_id;
            const user_id = req.body.user_id;
        
            return addCart(cart_id, user_id)
            .then(() => res.status(201).send("New Records Inserted!"))
            .catch(next);
        });
            console.log("Cart table created");
        }).catch((error) => {
            console.log(error);
        })
}

// Get cart items
module.exports.getCartItems = function getCartItems() {
    return pool.query(`SELECT  from cartItems`)
        .then((response) => response.rows)
        .catch((error) => {
            throw error;
        });
};

// Add new cart item
module.exports.addCartItem = function addCartItem(id, cart_id, product_id, quantity) {
    return pool.query(`INSERT INTO cartItem (id, cart_id, product_id, quantity) VALUES($1, $2, $3, $4) RETURNING *`, [id, cart_id, product_id, quantity])
        .then(() => console.log("Records Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};