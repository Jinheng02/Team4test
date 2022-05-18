// // includes
// const express = require('express');
// const cors = require('cors');
// const { createUserTable } = require('./controller/user');

// // const { Pool } = require('pg');
// // const pool = new Pool({
// //   connectionString: process.env.DATABASE_URL,
// //   ssl: {
// //     rejectUnauthorized: false
// //   }
// // });
// const pool = require("./dbConnection");

// // import product table
// const { createProductTable, add } = require("./controller/product.js");

// // initialize
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// // basic route
// app.get('/',(req, res)=> {
//     res.send(`<h1>Server running on port ${PORT}</h1> <h3>Version 1.0</h3>`)
// });

// // this table is just for testing
// const CREATE_TEST_TABLE_SQL = `
//     CREATE TABLE test_table (
//         testid SERIAL primary key,
//         testMessage VARCHAR not null
//     );
// `;

// // drop table for testing
// const DROP_TABLE_SQL = `
//     DROP TABLE IF EXISTS test_table;
// `;

// // creating table
// app.post('/test', async (req, res, next) => {
    
//     pool.query(CREATE_TEST_TABLE_SQL)
//     .then(() => {
//          res.send(`Table created`);
//     })
//     .catch((error) => {
//         res.send(error);
//     });
// });

// // creating product table
// app.post('/productTable', async (req, res, next) => {
    
//     return createProductTable()
//     .then(() => res.status(201).send("Product table created!"))
//     .catch(next);
// });

// // add new product
// app.post('/product', async (req, res, next) => {
//     const name = req.body.name;
//     const price = req.body.price;
//     const desc = req.body.desc;

//     return add(name, price, desc)
//     .then(() => res.status(201).send("New Records Inserted!"))
//     .catch(next);
// });

// // deleting table
// app.delete('/test', async (req, res, next) => {
    
//     pool.query(DROP_TABLE_SQL)
//     .then(() => {
//         res.send(`Table dropped`);
//     })
//     .catch((error) => {
//         res.send(error);
//     });
// });

// // insert content into test_table
// app.post('/test/message', async (req, res, next) => {
//     try {
//         var testm = req.body.testMessage;
//         const newMsgInsert = await pool.query("INSERT INTO test_table (testmessage) VALUES ($1) RETURNING *", [testm]);
//         res.json(newMsgInsert);
//       }
//       catch (err) {
//         console.error(err);
//         res.send(err);
//       }
// });

// // get the table
// app.get('/db', async (req, res) => {
//     try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM test_table');
//     const results = { 'results': (result) ? result.rows : null};
//     res.send(results.result);
//     } catch (err) {
//     console.error(err);
//     res.send(err);
//     }
// });

// // to create the user table
// app.post('/userTable', async (req, res, next) => {
//     return createUserTable()
//     .then(() => res.status(201).send("User table created!"))
//     .catch(next);
// });

// // make the app listen
// app.listen(PORT, ()=> {
//     console.log(`App listening to port ${PORT}`);
// });