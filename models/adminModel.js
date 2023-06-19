const mongoose = require('mongoose');
const AVATAR_PATH = "/uploads/Admins";

const multer = require('multer');

const path = require('path');

const AdminSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    hobby: {
        type: Array,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    updatedAt: {
        type: String,
        required: true
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', AVATAR_PATH))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

AdminSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');

AdminSchema.statics.avatarPath = AVATAR_PATH;

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;