/////////////////////////////////////////////////////////////
// this file is used for queries to users table in database
////////////////////////////////////////////////////////////

// import dbConnection
const pool = require("../dbConnection");

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
        created_at TIMESTAMP without time zone DEFAULT CURRENT_TIMESTAMP
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
// module.exports.addUser = function addUser(email, fullname) {
//     return pool.query(`INSERT INTO users (email, fullname) VALUES($1, $2) RETURNING *`, [email, fullname])
//         .then(() => console.log("New User Records Inserted!"))
//         .catch((error) => {
//             console.log(error);
//         });
// };

// to drop the users table
module.exports.dropUsersTable= function dropUsersTable() {
    return pool.query(DROP_USERS_TABLE)
        .then(() => {
            console.log("Users Table Dropped Successfully!");
        }).catch((error) => {
            console.log(error);
        });
};

// // Get users
// module.exports.get = function get(name, price, desc) {
//     return pool.query(`select * from products`)
//         .then(() => console.log("Records Inserted!"))
//         .catch((error) => {
//             console.log(error);
//         });
// };