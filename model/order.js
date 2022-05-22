const pool = require("../dbConnection");

const CREATE_ORDERS_TABLE = `
    CREATE TABLE orders (
        order_id SERIAL primary key,
        userid INT NOT NULL,
        productid INT NOT NULL,
        quantity INT NOT NULL,
        shipping_address VARCHAR(200),
        total DECIMAL(8, 2) NOT NULL,
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
    ADD FOREIGN KEY (productid) REFERENCES products(product_id);
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

