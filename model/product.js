const pool = require("../dbConnection");

const CREATE_PRODUCT_TABLE = `
    CREATE TABLE products (
        product_id SERIAL primary key,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(6,2) NOT NULL,
        description VARCHAR(255) NOT NULL,
        image_url VARCHAR(100) NULL,
        category_id INT NOT NULL
    )
`

// const ALTER_PRODUCT_TABLE = `
//     ALTER TABLE products
//     ADD FOREIGN KEY (category_id) REFERENCES categories(category_id);
// `

const DROP_TABLE_SQL = `
    DROP TABLE IF EXISTS products;
`

// Create Product Table
module.exports.createProductTable = function createProductTable(){
    return pool.query(CREATE_PRODUCT_TABLE)
        .then(() => {
            console.log("Products table created!");
        }).catch((err) => {
            console.log(err);
        })
};

// Delete Product Table
module.exports.deleteProductTable = function deleteProductTable(){
    return pool.query(DROP_TABLE_SQL)
        .then(() => {
            console.log("Products table deleted!");
        }).catch((err) => {
            console.log(err);
        })
};

// Add products 
module.exports.addProduct = function addProduct(name, price, desc, image_url, category_id) {
    return pool.query(`INSERT INTO products (name, price, description, image_url, category_id) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [name, price, desc, image_url, category_id])
        .then(() => console.log("Records Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};

// Get Products
module.exports.getProduct = function getProduct() {
    return pool.query(`SELECT * FROM products`)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// Get Product By Id
module.exports.getProductById = function getProductById(productid) {
    return pool.query(`SELECT * FROM products where product_id = ` + productid)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// Update Product
module.exports.updateProduct = function updateProduct(name, price, desc, image_url, category_id, product_id) {
    return pool.query(`Update products 
        set name = $1, 
            price = $2, 
            description = $3, 
            image_url = $4, 
            category_id = $5
        WHERE product_id = $6 RETURNING *`,
        [name, price, desc, image_url, category_id, product_id])
        .then(() => console.log("Records Updated!"))
        .catch((error) => {
            console.log(error);
        });
};

// Update Product
// module.exports.alterProductTable = function alterProductTable() {
//     return pool.query(ALTER_PRODUCT_TABLE)
//         .then(() => console.log("Table altered!"))
//         .catch((error) => {
//             console.log(error);
//         });
// };