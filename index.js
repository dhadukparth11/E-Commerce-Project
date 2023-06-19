const express = require('express');
const port = 8880;
const app = express();
const path = require('path')

// const db = require('./config/mongoose');
const mongoose = require('mongoose');
const url = `mongodb+srv://dhadukparth11:DHADUK123@cluster0.6laod7v.mongodb.net/E-Commerce?retryWrites=true`


mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to the database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
    })

const passport = require('passport');
const passportLocal = require('./config/passport-local');
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');

app.use(express.urlencoded())
app.use(express.static('adminAssetes'));
app.use(express.static('userAssetes'));
app.use('/uploads', express.static(path.join(__dirname, "uploads")));

app.use(session({
    name: "Admin",
    secret: "CODE",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10000 * 60 * 60
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleware.setFlash);

app.use('/', require('./routes/adminRoutes/adminRoutes'));
app.use('/user', require('./routes/userRoutes/userRoutes'));

app.listen(port, (err) => {
    if (!err) {
        console.log("server is start on : " + port);
    }
    else {
        console.log("server is not start on : " + port);
    }
});