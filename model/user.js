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

// To create user table
module.exports.createUsersTable = function createUserTable() {
    return pool.query(CREATE_USERS_TABLE)
        .then(() => {
            console.log("User table created");
        }).catch((error) => {
            console.log(error);
        });
};

// to ADD new user to the users table in the database
module.exports.addUser = function addUser(username, fullname, email, password, address, role) {
    return pool.query(`INSERT INTO users (username, fullname, email, password, address, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING username, fullname, email, role`, [username, fullname, email, password, address, role])
        .then((response) => response.rows[0])
        .catch((error) => {
            if (error.code === POSTGRES_ERROR_CODE.UNIQUE_CONSTRAINT) {
                throw createdHttpError(422, `Field(s) entered already exists`);
            }
            else {
                throw error; // unexpected error
            }
        });
};

// to UPDATE user info in users table in the database
module.exports.updateUser = function updateUser(username, fullname, email, address, userid) {
    return pool.query(`UPDATE users SET username = $1, fullname = $2, email = $3, address = $4 WHERE userid = $5 RETURNING username, fullname, email, address`, [username, fullname, email, address, userid])
        .then((response) => response.rows[0])
        .catch((error) => {
            if (error.code === POSTGRES_ERROR_CODE.UNIQUE_CONSTRAINT) {
                throw createdHttpError(422, `Field(s) entered already exists`);
            }
            else {
                throw error; // unexpected error
            }
        });
};

// to drop the users table
module.exports.dropUsersTable= function dropUsersTable() {
    return pool.query(DROP_USERS_TABLE)
        .then(() => {
            console.log("Users Table Dropped Successfully!");
        }).catch((error) => {
            console.log(error);
        });
};