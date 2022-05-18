const pool = require("../dbConnection");

const CREATE_PRODUCT_TABLE = `
    CREATE TABLE products (
        product_id SERIAL primary key,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(6,2) NOT NULL,
        desc VARCHAR(255) NOT NULL
        image_url VARCHAR(255) NULL,
        category_id INT foreign key REFERENCES categories(category_id)
    )
`

const DROP_TABLE_SQL = `
    DROP TABLE IF EXISTS products;
`

module.exports.createProductTable = function createProductTable(){
    return pool.query(CREATE_PRODUCT_TABLE)
        .then(() => {
            console.log("Products table created");
        }).catch((err) => {
            console.log(err);
        })
};

module.exports.deleteProductTable = function deleteProductTable(){
    return pool.query(DROP_TABLE_SQL)
        .then(() => {
            console.log("Products table deleted!");
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

module.exports.getProduct = function getProduct() {
    return pool.query(`SELECT * FROM products`)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// module.exports.getProductById = function getProductById(product_Id) {
//     return pool.query(`SELECT * FROM products`)
//         .then((results) => results.rows)
//         .catch((error) => {
//             console.log(error);
//         });
// };