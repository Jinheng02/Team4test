// includes
const app = require('./controller/app');

const port = process.env.PORT || 3000;

const server = app.listen(port, ()=> {
    console.log(`App listening to port ${port}`);
});