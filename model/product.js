const pool = require("../dbConnection");

const CREATE_PRODUCT_TABLE = `
    CREATE TABLE products (
        product_id SERIAL primary key,
        product_name VARCHAR(100) NOT NULL,
        product_price VARCHAR(100) NOT NULL,
        product_desc VARCHAR(100) NOT NULL
    )
`

module.exports.createProductTable = function createProductTable(){
    return pool.query(CREATE_PRODUCT_TABLE)
        .then(() => {
            console.log("Products created");
        }).catch((err) => {
            console.log(err);
        })
};

module.exports.addProduct = function addProduct(name, price, desc) {
    return pool.query(`INSERT INTO products (product_name, product_price, product_desc) VALUES($1, $2, $3) RETURNING *`, [name, price, desc])
        .then(() => console.log("Records Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};