const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/adminModel');
const User = require('../models/userModel')

passport.use('admin', new LocalStrategy({
    usernameField: 'email'
}, async function (email, password, done) {
    let admin = await Admin.findOne({ email: email });
    if (!admin || admin.password != password) {
        return done(null, false)
    }
    else {
        return done(null, admin);
    }
}))

passport.use('user', new LocalStrategy({
    usernameField: 'email'
}, async function (email, password, done) {
    let user = await User.findOne({ email: email });
    if (!user || user.password != password) {
        return done(null, false)
    }
    else {
        return done(null, user);
    }
}))

passport.serializeUser(function (admin, done) {
    return done(null, admin.id);
})

passport.deserializeUser(async function (id, done) {
    let AdminData = await Admin.findById(id);
    if (AdminData) {
        return done(null, AdminData);
    }
    else {
        let userData = await User.findById(id);
        if (userData) {
            return done(null, userData);
        } else {
            return done(null, false);
        }
    }
})

passport.checkAdmin = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        return res.redirect('/');
    }
}
passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.role == 'Admin') {
            res.locals.admin = req.user;
        }
        else {
            res.locals.user = req.user;
        }

    }
    next();
}
module.exports = passport