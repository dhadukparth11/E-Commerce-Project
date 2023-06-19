const Category = require('../../models/categoryModel');
const SubCategory = require('../../models/subcategoryModel');
const ExtraCategory = require('../../models/extracategoryModel');
const Product = require('../../models/productModel');
const Brand = require('../../models/brandModel');
const Type = require('../../models/typeModel');
const User = require('../../models/userModel');
const Cart = require('../../models/cartModel');
const { use } = require('../../routes/userRoutes/userRoutes');

const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.home = async (req, res) => {
    let cateData = await Category.find({ isActive: true });
    let subData = await SubCategory.find({ isActive: true });
    let extraData = await ExtraCategory.find({ isActive: true });
    var cartData = 0;
    if (req.user) {
        let userCartCount = await Cart.find({ user_id: req.user.id }).countDocuments();
        req.session.cartData = userCartCount;
        cartData = req.session.cartData;
    }
    return res.render('user/home', {
        'cartData': cartData,
        'cateData': cateData,
        'subData': subData,
        'extraData': extraData,
    })
}
module.exports.products = async (req, res) => {
    let cateId = req.params.Id;
    let subId = req.params.subId;
    let extraId = req.params.extraId;
    let productData = await Product.find({ categoryId: cateId, subcategoryId: subId, extracategoryId: extraId });
    let brandData = await Brand.find({ categoryId: cateId, subcategoryId: subId, extracategoryId: extraId });
    let typeData = await Type.find({ categoryId: cateId, subcategoryId: subId, extracategoryId: extraId });

    let cateData = await Category.find({ isActive: true });
    let subData = await SubCategory.find({ isActive: true });
    let extraData = await ExtraCategory.find({ isActive: true });

    var cartData = 0;
    if (req.user) {
        cartData = req.session.cartData;
    }
    return res.render('user/products', {
        'cartData': cartData,
        'productData': productData,
        'cateData': cateData,
        'subData': subData,
        'extraData': extraData,
        'brandData': brandData,
        'typeData': typeData,
    })
}
module.exports.findBrandWisedata = async (req, res) => {
    if (req.body.brandIds) {
        var productData = await Product.find({ 'brandId': req.body.brandIds });
    } else {
        var productData = await Product.find({});
    }
    return res.render('user/brandFilter', {
        'brandFilter': productData
    })
}
module.exports.register = async (req, res) => {
    let cateData = await Category.find({ isActive: true });
    let subData = await SubCategory.find({ isActive: true });
    let extraData = await ExtraCategory.find({ isActive: true });

    var cartData = 0;
    if (req.user) {
        cartData = req.session.cartData;
    }

    return res.render('user/signin', {
        'cartData': cartData,
        'cateData': cateData,
        'subData': subData,
        'extraData': extraData,
    })
}

module.exports.singleProduct = async (req, res) => {
    let productId = req.params.Id;
    let productData = await Product.findById(productId)
    let cateData = await Category.find({ isActive: true });
    let subData = await SubCategory.find({ isActive: true });
    let extraData = await ExtraCategory.find({ isActive: true });

    var cartData = 0;
    if (req.user) {
        cartData = req.session.cartData;
    }

    return res.render('user/singleProduct', {
        'cartData': cartData,
        'cateData': cateData,
        'subData': subData,
        'extraData': extraData,
        'productData': productData,
    });
}

module.exports.insertSignin = async (req, res) => {

    let checkMail = await User.findOne({ email: req.body.email });
    if (checkMail) {
        return res.render('back')

    } else {
        req.body.role = "User"
        req.body.isActive = true;
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;

        let userData = await User.create(req.body);
        if (userData) {
            return res.redirect('back');
        }
        else {
            console.log("semthing wrong");
            return res.redirect('back');
        }
    }
}

module.exports.loginPage = async (req, res) => {
    let cateData = await Category.find({ isActive: true });
    let subData = await SubCategory.find({ isActive: true });
    let extraData = await ExtraCategory.find({ isActive: true });

    var cartData = 0;
    if (req.user) {
        cartData = req.session.cartData;
    }

    return res.render('user/user_login', {
        'cateData': cateData,
        'subData': subData,
        'extraData': extraData,
        'cartData': cartData,
    });
}
module.exports.userLoginData = async (req, res) => {
    req.flash('success', "Login Successfully");
    return res.redirect('/user/');
}

module.exports.addTocart = async (req, res) => {
    let cartData = await Cart.find({ user_id: req.body.user_id, product_id: req.body.product_id });
    if (cartData.length == 0) {
        const nDate = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Calcutta'
        });
        console.log("cart data added");
        req.body.isActive = true;
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        await Cart.create(req.body);

        let userCartCount = await Cart.find({ user_id: req.body.user_id }).countDocuments();
        req.session.cartData = userCartCount;

        return res.redirect('back');
    }
    else {
        return res.redirect('back');

    }
}

module.exports.cartPage = async (req, res) => {
    let cateData = await Category.find({ isActive: true });
    let subData = await SubCategory.find({ isActive: true });
    let extraData = await ExtraCategory.find({ isActive: true });
    var cartData = 0;
    if (req.user) {
        let userCartCount = await Cart.find({ user_id: req.user.id }).countDocuments();
        req.session.cartData = userCartCount;
        cartData = req.session.cartData;
    }
    else {
        return res.redirect('/user');
    }
    let cartUserData = await Cart.find({ 'user_id': req.user.id }).populate('product_id').exec()
    return res.render('user/cart', {
        'cartData': cartData,
        'cateData': cateData,
        'subData': subData,
        'extraData': extraData,
        'cartUserData': cartUserData
    })
}
module.exports.productQuantity = async (req, res) => {
    let cartQu = await Cart.findOne({ product_id: req.body.productId, user_id: req.user.id });
    console.log(cartQu);
    if (cartQu) {
        let cartupdate = await Cart.findByIdAndUpdate(cartQu.id, {
            quantity: req.body.quantity
        });
        if (cartupdate) {
            return res.json({ msg: "quantity Updated" });
        }
        else {
            return res.json({ msg: "something wrong" });
        }
    }
}

module.exports.removeCart = async (req,res) =>{
    // console.log(req.params.id);
    let rCart = await Cart.findByIdAndDelete(req.params.id);
    if(rCart){
        req.flash('success', "Product Remove from Cart");
        return res.redirect('back');
    }
    else{
        req.flash('error', "Something wrong");
        return res.redirect('back');
    }
}