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

module.exports.addProduct = function addProduct(name, price, desc, image_url, category_id) {
    return pool.query(`INSERT INTO products (name, price, description, image_url, category_id) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [name, price, desc, image_url, category_id])
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

module.exports.getProductById = function getProductById(productid) {
    return pool.query(`SELECT * FROM products where product_id = ` + productid)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

module.exports.updateProduct = function updateProduct(name, price, desc, image_url, category_id, product_id) {
    return pool.query(`Update products 
        set 
            name = `(name)`, 
            price = `(price)`, 
            description = `(desc)`, 
            image_url = `(image_url)`, 
            category_id = `(category_id)` 
        WHERE product_id = `, product_id, `RETURNING *`)
        .then(() => console.log("Records Updated!"))
        .catch((error) => {
            console.log(error);
        });
};