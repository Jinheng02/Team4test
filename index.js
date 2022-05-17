// includes
const express = require('express');
const cors = require('cors');

// include module from db.js to use Postgres Pool
const pool = require('./db'); //Import from db.js

// initialize
const app = express();
const PORT = process.env.PORT || 3000;

// basic route
app.get('/',(req, res)=> {
    res.send(`<h1>Server running on port ${PORT}</h1> <h3>Version 1.0</h3>`)
});

// this table is just for testing
const CREATE_TEST_TABLE_SQL = `
    CREATE TABLE test_table (
        testid SERIAL primary key,
        testMessage VARCHAR not null
    );
`;

app.post('/test', async (req, res, next) => {
    
    pool.query(CREATE_TEST_TABLE_SQL)
    .then(() => {
         res.send(`Table created`);
    })
    .catch((error) => {
        res.send(error);
    });
});

// make the app listen
app.listen(PORT, ()=> {
    console.log(`App listening to port ${PORT}`);
});