const express = require('express');

const routes = express.Router();

const Admin = require('../../models/adminModel');

const passport = require('passport');

const adminConroller = require('../../controller/adminController/adminController');

routes.get('/', adminConroller.login);

routes.get('/dashboard', passport.checkAdmin, adminConroller.dashboard);

routes.get('/AddAdmin', passport.checkAdmin, adminConroller.add_admin);

routes.post('/insertAdmin', passport.checkAdmin, Admin.uploadedAvatar, adminConroller.insertAdmin);

routes.get('/view_admin', passport.checkAdmin, adminConroller.view_admin);

routes.post('/checkLogin', passport.authenticate('admin', { failureRedirect: '/',failureFlash :  "Invalid email & password" }), adminConroller.checkLogin);

routes.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        }
        next();
    });
    return res.redirect('/');
})

routes.use('/category', passport.checkAdmin, require('./categoryRoutes'));

routes.use('/subcategory', passport.checkAdmin, require('./subcategoryRoutes'));

routes.use('/extracategory', passport.checkAdmin, require('./extracategoryRoutes'));

routes.use('/brand', passport.checkAdmin, require('./brandRoutes'));

routes.use('/type', passport.checkAdmin, require('./typeRoutes'));

routes.use('/product', passport.checkAdmin, require('./productRoutes'));

module.exports = routes;