import express from 'express';
import homeController from '../controller/homeController';
import multer from 'multer';
import path from 'path'

let appRoot = require('app-root-path');
let router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + '/src/public/image/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const initWebRoute = (app) => {
    router.get("/", homeController.getHomePage)
    router.get("/detail/user/:userId", homeController.getDetailUser)
    router.post("/create-new-user", homeController.createUser)
    router.post("/delete-user/:userID", homeController.deleteUser)

    router.get("/edit-user/:id", homeController.editUser)
    router.post("/update-user", homeController.updateUser)

    router.get("/upload", homeController.uploadFile)

    router.post("/upload-profile-pic",
        multer({ storage: storage, fileFilter: imageFilter }).single('profile_pic'),
        homeController.handleUploadFile)

    router.post("/upload-multiple-images",
        multer({ storage: storage, fileFilter: imageFilter }).array('multiple_images', 5),
        homeController.uploadMultipleImages)

    return app.use("/", router);
}

module.exports = initWebRoute;