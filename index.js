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
    res.send(`Server running on port ${PORT}`)
});

// make the app listen
app.listen(PORT, ()=> {
    console.log(`App listening to port ${PORT}`);
});