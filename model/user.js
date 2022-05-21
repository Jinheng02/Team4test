/////////////////////////////////////////////////////////////
// this file is used for queries to users table in database
////////////////////////////////////////////////////////////

// import dbConnection
const pool = require("../dbConnection");

// import http-errors module
const createdHttpError = require('http-errors');

// query to create the users table
const CREATE_USERS_TABLE = `
    CREATE TABLE users  (
        userid SERIAL NOT NULL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        fullname VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        address VARCHAR(200),
        role VARCHAR(45) NOT NULL,
        created_at TIMESTAMP without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
`
// query to drop the users table
const DROP_USERS_TABLE = `
    DROP TABLE IF EXISTS users;
`

const User = {
    // get all the users in the database method 
    getUsers : function (callback) {
        const getAllUsersQuery = `SELECT userid, username, fullname, email, role FROM users`;
        pool.query(getAllUsersQuery, (error, result) => {
            if (error) {
                return callback(error, null);
            }
            // no error
            else {
                return callback(null, result.rows);
            }
        })
    }
}

module.exports = User;