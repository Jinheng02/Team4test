const pool = require("../dbConnection");

const CREATE_ORDERS_TABLE = `
    CREATE TABLE orders (
        order_id SERIAL primary key,
        user_id INT NOT NULL,
        amount REAL NOT NULL,
        total INT NOT NULL,
        payment_method VARCHAR(100) NOT NULL,
        checkout_status VARCHAR(100) NOT NULL,
        ref VARCHAR(100) NOT NULL,
        date_created TIMESTAMP without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
`
// to create orders table 
module.exports.createOrdersTable = function createOrdersTable() {
    return pool.query(CREATE_ORDERS_TABLE)
        .then(() => {
            console.log("Orders table created");
        }).catch((error) => {
            console.log(error);
        })
}

module.exports.addOrder = function addOrder(user_id, amount, total, payment_method, checkout_status, ref) {
    return pool.query(`INSERT INTO orders (user_id, amount, total, payment_method, checkout_status, ref) VALUES($1, $2, $3, $4, 'complete', $5) RETURNING *`, [user_id, amount, total, payment_method, checkout_status, ref])
        .then(() => console.log("New Order Records Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};