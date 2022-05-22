const pool = require("../dbConnection");

const CREATE_CATEGORY_TABLE = `
    CREATE TABLE category (
        categoryid SERIAL primary key,
        categoryname VARCHAR(100) NOT NULL,
        CONSTRAINT fk_category
            FOREIGN KEY(categoryid) 
                REFERENCES products(categoryid)
                    ON DELETE CASCADE
    )
`

const DROP_TABLE_SQL = `
    DROP TABLE IF EXISTS categories CASCADE;
`

// Create Category Table
module.exports.createCategoryTable = function createCategoryTable(){
    return pool.query(CREATE_CATEGORY_TABLE)
        .then(() => {
            console.log("Category table created!");
        }).catch((err) => {
            console.log(err);
        })
};

// Delete Category Table
module.exports.deleteCategoryTable = function deleteCategoryTable(){
    return pool.query(DROP_TABLE_SQL)
        .then(() => {
            console.log("Category table deleted!");
        }).catch((err) => {
            console.log(err);
        })
};

// Add categories
module.exports.addCategory = function addCategory(category_name) {
    return pool.query(`INSERT INTO category (categoryname) VALUES($1) RETURNING *`,
        [category_name])
        .then(() => console.log("Category Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};

// Get Categories
module.exports.getCategory = function getCategory() {
    return pool.query(`SELECT * FROM category`)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// Get Categories
module.exports.getCategoryById = function getCategoryById(categoryid) {
    return pool.query(`SELECT * FROM category where categoryid = ` + categoryid)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};