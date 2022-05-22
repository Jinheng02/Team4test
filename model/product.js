const pool = require("../dbConnection");

const CREATE_PRODUCT_TABLE = `
    CREATE TABLE products (
        productid SERIAL primary key,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(6,2) NOT NULL,
        description VARCHAR(255) NOT NULL,
        products_img_url VARCHAR(100) NULL,
        categoryid INT NOT NULL
    )
`

// const ALTER_PRODUCT_TABLE = `
//     ALTER TABLE products
//     ADD FOREIGN KEY (categoryid) REFERENCES category(categoryid);
// `

const ALTER_PRODUCT_TABLE = `
    ALTER TABLE products
    ADD products_img_url VARCHAR(100);
`

const DROP_TABLE_SQL = `
    DROP TABLE IF EXISTS products CASCADE;
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
module.exports.addProduct = function addProduct(name, price, desc, categoryid) {
    return pool.query(`INSERT INTO products (name, price, description, categoryid) 
        VALUES($1, $2, $3, $4) RETURNING *`,
        [name, price, desc, categoryid])
        .then(() => console.log("Product Inserted!"))
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
    return pool.query(`SELECT * FROM products WHERE productid = ` + productid)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// Update Product
module.exports.updateProduct = function updateProduct(name, price, desc, categoryid, productid) {
    return pool.query(`Update products 
        set name = $1, 
            price = $2, 
            description = $3, 
            categoryid = $4
        WHERE productid = $5 RETURNING *`,
        [name, price, desc, categoryid, productid])
        .then(() => console.log("Product Updated!"))
        .catch((error) => {
            console.log(error);
        });
};

// Delete Product By Id
module.exports.deleteProduct = function deleteProduct(productid) {
    return pool.query(`DELETE FROM products WHERE productid = ` + productid)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// Update Product
module.exports.alterProductTable = function alterProductTable() {
    return pool.query(ALTER_PRODUCT_TABLE)
        .then(() => console.log("Table altered!"))
        .catch((error) => {
            console.log(error);
        });
};