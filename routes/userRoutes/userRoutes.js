const express = require('express');

const routes = express.Router();
const passport = require('passport')

const userController = require('../../controller/userController/userController')

routes.get('/', userController.home)

routes.get('/products/:Id/:subId/:extraId', userController.products);

routes.post('/findBrandWisedata', userController.findBrandWisedata);

routes.get('/singleProduct/:Id', userController.singleProduct);

routes.get('/register', userController.register);

routes.post('/insertSignin', userController.insertSignin);

routes.get('/login', userController.loginPage);

routes.post('/userLoginData', passport.authenticate('user', { failureRedirect: "/user/login",failureFlash : "Invalid user email & password" }), userController.userLoginData);

routes.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        }
        next();
    });
    return res.redirect('/user/');
})
routes.post('/addTocart', userController.addTocart);

routes.get('/cartPage', userController.cartPage)

routes.post('/productQuantity', userController.productQuantity);

routes.get("/removeCart/:id", userController.removeCart);

module.exports = routes