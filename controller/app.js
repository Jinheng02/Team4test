// includes
const express = require('express');
const cors = require('cors');
// for user database
// for product database
const { add } = require("../model/product");

const PORT = process.env.PORT || 3000;

// initialize
const app = express();

// allow for cross-origin and json
app.use(cors());
app.use(express.json());

// basic route
// to test whether server is running
app.get('/',(req, res)=> {
    res.send(`<h1>Server running on port ${PORT}</h1> <h3>Version 1.0</h3>`)
});

// to add new product to the products database
app.post('/product', async (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const desc = req.body.desc;

    return add(name, price, desc)
    .then(() => res.status(201).send("New Records Inserted!"))
    .catch(next);
});

module.exports = app;