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


module.exports.addOrder = function addOrder(user_id, amount, total, payment_method, checkout_status, ref) {
    return pool.query(`INSERT INTO orders (user_id, amount, total, payment_method, checkout_status, ref) VALUES($1, $2, $3, $4, 'complete', $5) RETURNING *`, [user_id, amount, total, payment_method, checkout_status, ref])
        .then(() => console.log("New Order Records Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};