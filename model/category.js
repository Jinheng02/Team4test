const pool = require("../dbConnection");

const CREATE_CATEGORY_TABLE = `
    CREATE TABLE categories (
        category_id SERIAL primary key,
        category_name VARCHAR(100) NOT NULL
    )
`

const DROP_TABLE_SQL = `
    DROP TABLE IF EXISTS categories;
`

// Create Category Table
module.exports.createCategoryTable = function createCategoryTable(){
    return pool.query(CREATE_CATEGORY_TABLE)
        .then(() => {
            console.log("Categories table created!");
        }).catch((err) => {
            console.log(err);
        })
};

// Delete Category Table
module.exports.deleteCategoryTable = function deleteCategoryTable(){
    return pool.query(DROP_TABLE_SQL)
        .then(() => {
            console.log("Categories table deleted!");
        }).catch((err) => {
            console.log(err);
        })
};

// Add categories
module.exports.addCategory = function addCategory(category_id, category_name) {
    return pool.query(`INSERT INTO products (category_id, category_name) VALUES($1, $2) RETURNING *`,
        [category_id, category_name])
        .then(() => console.log("Category Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};

// Get Categories
module.exports.getCategory = function getCategory() {
    return pool.query(`SELECT * FROM categories`)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};