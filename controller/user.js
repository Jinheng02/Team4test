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