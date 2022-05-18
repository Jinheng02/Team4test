const pool = require("../dbConnection");

const CREATE_USER_TABLE = `
    CREATE TABLE users  (
        user_id SERIAL primary key,
        email VARCHAR(100) NOT NULL UNIQUE,
        fullname VARCHAR(100) NOT NULL,
        created_at TIMESTAMP
    );
`

// To create user table
module.exports.createUserTable = function createUserTable() {
    return pool.query(CREATE_USER_TABLE)
        .then(() => {
            console.log("User table created");
        }).catch((error) => {
            console.log(error);
        })
}

module.exports.add = function add(name, price, desc) {
    return pool.query(`INSERT INTO products (product_name, product_price, product_desc) VALUES($1, $2, $3) RETURNING *`, [name, price, desc])
        .then(() => console.log("Records Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};

module.exports.get = function add(name, price, desc) {
    return pool.query(`select * from products`)
        .then(() => console.log("Records Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};