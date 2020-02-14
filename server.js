const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const chalk = require('chalk')
const bodyParser = require('body-parser')
const productRouter = require('./routes/products')
const usersRouter = require('./routes/user')

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({
    extended: false
}));
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(morgan('dev'));

MONGO_URI = "mongodb://127.0.0.1:27017/test2";

app.use('/products', productRouter)
app.use('/users', usersRouter)

app.use((error, req, res, next) => {
    console.log(chalk.bgRed(error));
    const status = error.statusCode || 500;
    var message = (status === 500) ? "Server Error" : error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});


const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI, () => {
    console.log(chalk.bgGreen.black("Connected"))
    app.listen(PORT, () =>
        console.log(chalk.bgBlue.black(`Server started on port ${PORT}`)))
});