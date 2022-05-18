// includes
const app = require('./controller/app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, ()=> {
    console.log(`App listening to port ${PORT}`);
});