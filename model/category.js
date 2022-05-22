const pool = require("../dbConnection");

const CREATE_CATEGORY_TABLE = `
    CREATE TABLE category (
        categoryid SERIAL primary key,
        categoryname VARCHAR(100) NOT NULL
    )
`

const DROP_TABLE_SQL = `
    DROP TABLE IF EXISTS category CASCADE;
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

// Add category
module.exports.addCategory = function addCategory(categoryname) {
    return pool.query(`INSERT INTO category (categoryname) VALUES($1) RETURNING *`,
        [categoryname])
        .then(() => console.log("Category Inserted!"))
        .catch((error) => {
            console.log(error);
        });
};

// Get Category
module.exports.getCategory = function getCategory() {
    return pool.query(`SELECT * FROM category`)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// Get Category By Id
module.exports.getCategoryById = function getCategoryById(categoryid) {
    return pool.query(`SELECT * FROM category where categoryid = ` + categoryid)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// Delete Category By Id
module.exports.deleteCategoryById = function deleteCategoryById(categoryid) {
    return pool.query(`DELETE FROM category where categoryid = ` + categoryid)
        .then((results) => results.rows)
        .catch((error) => {
            console.log(error);
        });
};

// Update category
module.exports.updateCategory = function updateCategory(categoryname, categoryid) {
    return pool.query(`UPDATE category 
        set categoryname = $1
        WHERE categoryid = $2 RETURNING *`,
        [categoryname, categoryid])
        .then(() => console.log("category Updated!"))
        .catch((error) => {
            console.log(error);
        });
};