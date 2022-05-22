const pool = require("../dbConnection");

const CREATE_ORDERS_TABLE = `
    CREATE TABLE orders (
        order_id SERIAL primary key,
        userid INT NOT NULL,
        productid INT NOT NULL,
        quantity INT NOT NULL,
        shipping_address VARCHAR(200),
        total DECIMAL(8, 2),
        date TIMESTAMP without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
`

// drop table query
const DROP_TABLE_SQL = `
    DROP TABLE IF EXISTS orders;
`

// altering tables userid for foreign key
const ALTER_ORDERS_TABLE = `
    ALTER TABLE orders
    ADD FOREIGN KEY (userid) REFERENCES users(userid);
`

// altering tables productid for foreign key
const ALTER_ORDERSPRODUCTID_TABLE = `
    ALTER TABLE orders
    ADD FOREIGN KEY (productid) REFERENCES products(productid);
`

// to create orders table 
module.exports.createOrdersTable = function createOrdersTable() {
    return pool.query(CREATE_ORDERS_TABLE)
        .then(() => {
            console.log("Orders table created");
        }).catch((error) => {
            console.log(error);
        })
};


// get all orders from database method
module.exports.getOrders = function getOrders() {
    return pool.query(`SELECT * FROM orders`)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// get all orders by a specific userid
module.exports.getAllOrdersById = function getAllOrdersById(userid) {
    return pool.query(`SELECT p.name, p.products_img_url, o.total, u.address, u.username FROM ((orders o INNER JOIN products p ON p.productid = o.productid) INNER JOIN users u ON o.userid = u.userid) WHERE o.userid = $1 `,
    [userid])
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

//get orders by orderid
module.exports.getOrderByOrderId = function getOrderByOrderId(userid, orderid) {
    return pool.query(`SELECT p.name, p.products_img_url, o.total, u.address, u.username FROM ((orders o INNER JOIN products p ON p.productid = o.productid) INNER JOIN users u ON o.userid = u.userid) WHERE o.userid = $1 AND o.order_id = $2 `,
        [userid, orderid])
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

//insert data into orders table from cart and users
module.exports.insertDataIntoOrders = function insertDataIntoOrders(cartid) {
    //This query is to insert data from cart to orders table
    return pool.query(`INSERT INTO orders (userid, productid, quantity, shipping_address, total) SELECT c.userid, c.productid, c.quantity, u.address, (p.price * c.quantity) AS total FROM carts c INNER JOIN users u ON u.userid = c.userid INNER JOIN products p ON p.productid = c.productid WHERE cartid = ` + cartid)

    // .then(pool.query(`UPDATE orders SET shipping_address = u.address, total = (p.price * o.quantity) FROM ((orders o INNER JOIN users u ON o.userid = u.userid) INNER JOIN products p ON o.productid = p.productid) WHERE o.userid = ` + userid))

    // .then(pool.query(`UPDATE orders SET total = (p.price * o.quantity) FROM orders o INNER JOIN products p ON o.productid = p.productid WHERE o.userid = ` + userid))

    // .finally(pool.query(`DELETE FROM carts WHERE cartid = ` + cartid))

    // UPDATE orders SET shipping_address = u.address, total = (p.price * o.quantity) FROM orders o INNER JOIN users u ON o.userid = u.userid WHERE o.userid = 
    .catch((error) => {
        console.log(error);
    });
};


// insert new order database method
module.exports.addOrders = function addOrders(userid, total) {
    return pool.query(`INSERT INTO orders (userid, total) VALUES($1, $2) RETURNING *`,
        [userid, total])
        .then((result) => result)
        .catch((error) => {
            console.log(error);
        });
};

// to drop/delete orders table 
module.exports.deleteOrdersTable = function deleteOrdersTable(){
    return pool.query(DROP_TABLE_SQL)
        .then(() => {
            console.log("Orders table deleted!");
        }).catch((err) => {
            console.log(err);
        })
};

//alter table for userid foreign key
module.exports.alterOrdersTable = function alterOrdersTable() {
    return pool.query(ALTER_ORDERS_TABLE)
        .then(() => console.log("Orders Table altered!"))
        .catch((error) => {
            console.log(error);
        });
};


//alter table for productid foreign key
module.exports.alterOrdersProductIdTable = function alterOrdersProductIdTable() {
    return pool.query(ALTER_ORDERSPRODUCTID_TABLE)
        .then(() => console.log("Order's productid altered!"))
        .catch((error) => {
            console.log(error);
        });
};

// export the methods so that it can be used by the controller layer when the web service is being called
// call the function to retrieve the result 

