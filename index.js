// includes
const express = require('express');
const cors = require('cors');

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// initialize
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

// creating table
app.post('/test', async (req, res, next) => {
    
    pool.query(CREATE_TEST_TABLE_SQL)
    .then(() => {
         res.send(`Table created`);
    })
    .catch((error) => {
        res.send(error);
    });
});

// insert content into test_table
app.post('/test/message', async (req, res, next) => {
    var testm = req.body.testMassage
    const insertMessage = pool.query(`INSERT INTO test_table (testmessage) VALUES ($1) RETURNING *`, [testm])
    .then(() => {
        res.json(insertMessage);
    })
    .catch((error) => {
        res.send(error);
    });
});

// get the table
app.get('/db', async (req, res) => {
    try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null};
    res.send(result.result);
    } catch (err) {
    console.error(err);
    res.send(err);
    }
});

// make the app listen
app.listen(PORT, ()=> {
    console.log(`App listening to port ${PORT}`);
});