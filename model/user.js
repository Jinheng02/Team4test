/////////////////////////////////////////////////////////////
// this file is used for queries to users table in database
////////////////////////////////////////////////////////////

// import dbConnection
const pool = require("../dbConnection");

// // query to create the users table
// const CREATE_USERS_TABLE = `
//     CREATE TABLE users  (
//         userid SERIAL NOT NULL PRIMARY KEY,
//         username VARCHAR(50) UNIQUE NOT NULL,
//         fullname VARCHAR(100) NOT NULL,
//         email VARCHAR(100) NOT NULL UNIQUE,
//         password VARCHAR(100) NOT NULL,
//         address VARCHAR(200),
//         role VARCHAR(45) NOT NULL,
//         created_at TIMESTAMP without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
//     );
// `
// // query to drop the users table
// const DROP_USERS_TABLE = `
//     DROP TABLE IF EXISTS users;
// `

const User = {
    // get all the users in the database method 
    getUsers: function (callback) {
        const getAllUsersQuery = `SELECT userid, username, fullname, email, role FROM users`;
        pool.query(getAllUsersQuery, (error, result) => {
            if (error) {
                // return the error 
                return callback(error, null);
            }
            // no error
            else {
                // return the results with all the users
                return callback(null, result.rows);
            }
        });
    },   //-- end of getUsers method
    getUserById: function (userid, callback) {
        const getUserByIdQuery = `SELECT userid, username, fullname, email, address, role FROM users WHERE userid = $1`;
        pool.query(getUserByIdQuery, [userid], (error, result) => {
            if (error) {
                // return the error 
                return callback(error, null);
            }
            // no error
            else {
                // return the results with the user id entered
                return callback(null, result.rows);
            }
        });
    },  //-- end of getUsersById method
    addUser: function(username, fullname, email, password, address, role, callback) {
        const addUserQuery = `INSERT INTO users (username, fullname, email, password, address, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING userid, username, fullname, email, role, created_at`;
        pool.query(addUserQuery, [username, fullname, email, password, address, role], (error, result) => {
            if (error) {
                // return the error 
                return callback(error, null);
            }
            // no error
            else {
                // return the results
                return callback(null, result.rows[0]);
            }
        });
    },  //-- end of addUser method
    // to update a single user by the id
    updateUser: function(username, fullname, email, address, userid, callback) {
        const updateUserQuery = `UPDATE users SET username = $1, fullname = $2, email = $3, address = $4 WHERE userid = $5 RETURNING username, fullname, email, address`;
        pool.query(updateUserQuery, [username, fullname, email, address, userid], (error, result) => {
            if (error) {
                // return the error 
                return callback(error, null);
            }
            // no error
            else {
                // return the results
                return callback(null, result.rowCount);
            }
        })
    },   //-- end of addUser method
}

// export the User object so that it can be used by the controller layer when the web service is being called
// call the function to retrieve the result 
module.exports = User;