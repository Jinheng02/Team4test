const pool = require("../dbConnection");

const CREATE_ORDERS_TABLE = `
    CREATE TABLE orders (
        order_id SERIAL primary key,
        userid INT NOT NULL,
        total DECIMAL(8, 2) NOT NULL,
        date TIMESTAMP without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
`

const DROP_TABLE_SQL = `
    DROP TABLE IF EXISTS orders;
`

const ALTER_ORDERS_TABLE = `
    ALTER TABLE orders
    ADD FOREIGN KEY (userid) REFERENCES users(userid);
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

// to drop/delete orders table 
module.exports.deleteOrdersTable = function deleteOrdersTable(){
    return pool.query(DROP_TABLE_SQL)
        .then(() => {
            console.log("Orders table deleted!");
        }).catch((err) => {
            console.log(err);
        })
};

//alter table for foreign key
module.exports.alterOrdersTable = function alterOrdersTable() {
    return pool.query(ALTER_ORDERS_TABLE)
        .then(() => console.log("Orders Table altered!"))
        .catch((error) => {
            console.log(error);
        });
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
module.exports.addOrder = function addOrder(userid, total) {
    return pool.query(`INSERT INTO orders (userid, name) VALUES($1, $2) RETURNING *`,
        [userid, total])
        .then(() => console.log("Orders Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};