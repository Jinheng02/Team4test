// import the jwt library
const jwt = require('jsonwebtoken');
// import the secret key
const JWT_SECRET = require('../config');

var check = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // unauthorized
    if (authHeader == null || authHeader == undefined || !authHeader.startsWith('Bearer ')) {
        res.status(401).send();
    }
    else {
        const token = authHeader.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, (error, decodedToken) => {
            // error
            if (error) {
                // send 401 if verification is unsuccessful
                res.status(401).send();
                return;
            }
            // verification is successfull
            // store the decoded token in req.decodedToken
            // invoke next() to pass req and res object to the next middleware
            req.decodedToken = decodedToken;
            next();
        });
    }
};

module.exports = check;