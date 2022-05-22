const database = require('../dbConnection');

// queries to create all tables

// for users table
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
`;

// for products table
const CREATE_PRODUCT_TABLE = `
    CREATE TABLE products (
        productid SERIAL primary key,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(6,2) NOT NULL,
        description VARCHAR(255) NOT NULL,
        products_img_url VARCHAR(100) NULL,
        categoryid INT NOT NULL
    );
`;
const ALTER_PRODUCT_TABLE = `
    ALTER TABLE products
    ADD FOREIGN KEY (categoryid) REFERENCES category(categoryid);
`;

// for categories table
const CREATE_CATEGORY_TABLE = `
    CREATE TABLE category (
        categoryid SERIAL primary key,
        categoryname VARCHAR(100) NOT NULL
    );
`;

// for carts table
const CREATE_CARTS_TABLE = `
    CREATE TABLE carts (
        cartid SERIAL primary key,
        userid INT NOT NULL,
        productid INT NOT NULL,
        quantity INT NOT NULL
    );
`;
const ALTER_CARTS_TABLE = `
    ALTER TABLE carts
    ADD FOREIGN KEY (userid) REFERENCES users(userid);
`;

const ALTER_CARTSPRODUCTID_TABLE = `
    ALTER TABLE carts
    ADD FOREIGN KEY (productid) REFERENCES products(productid);
`;

// for orders table
const CREATE_ORDERS_TABLE = `
    CREATE TABLE orders (
        order_id SERIAL primary key,
        userid INT NOT NULL,
        productid INT NOT NULL,
        quantity INT NOT NULL,
        shipping_address VARCHAR(200),
        total DECIMAL(8, 2),
        date TIMESTAMP without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
`;

// altering tables userid for foreign key
const ALTER_ORDERS_TABLE = `
    ALTER TABLE orders
    ADD FOREIGN KEY (userid) REFERENCES users(userid);
`;

// altering tables productid for foreign key
const ALTER_ORDERSPRODUCTID_TABLE = `
    ALTER TABLE orders
    ADD FOREIGN KEY (productid) REFERENCES products(productid);
`;


database
    .query(
        `
        DROP TABLE IF EXISTS users, products, category, orders, carts;
        ${CREATE_USERS_TABLE} ${CREATE_PRODUCT_TABLE} ${CREATE_CATEGORY_TABLE} ${CREATE_CARTS_TABLE} ${CREATE_ORDERS_TABLE}
        ${ALTER_PRODUCT_TABLE} ${ALTER_ORDERS_TABLE} ${ALTER_CARTS_TABLE} ${ALTER_ORDERSPRODUCTID_TABLE} ${ALTER_CARTSPRODUCTID_TABLE}
        `,
    )
    .then(() => {
        console.log('All 5 tables successfully created!')
    })
    .catch((error) => {
        console.error(error);
    })
    .finally(() => {
        database.end();
    });