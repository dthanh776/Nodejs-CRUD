import pool from "../configs/connectDB";
import multer from "multer";

let getHomePage = async (req, res) => {
    const [rows, fields] = await pool.execute('SELECT * FROM `users`');
    return res.render("index.ejs", { data: rows });
}

let getDetailUser = async (req, res) => {
    let userId = req.params.userId;
    let [user] = await pool.execute('SELECT * FROM `users` WHERE `id` = ?', [userId]);
    return res.send(JSON.stringify(user));
}

let createUser = async (req, res) => {
    let { firstName, lastName, email, address } = req.body
    await pool.execute('INSERT INTO `users` (`firstName`, `lastName`, `email`,`address`) VALUES (?,?,?,?)', [firstName, lastName, email, address]);
    return res.redirect('/');
}

let deleteUser = async (req, res) => {
    let userID = req.params.userID;
    await pool.execute('DELETE FROM `users` WHERE `id` = ?', [userID])
    return res.redirect('/');
}

let editUser = async (req, res) => {
    let id = req.params.id
    let [user] = await pool.execute('SELECT * FROM `users` WHERE `id` =?', [id]);
    return res.render("update.ejs", { dataUser: user[0] });
}

let updateUser = async (req, res) => {
    let { firstName, lastName, email, address, id } = req.body
    await pool.execute('UPDATE users SET firstName = ?, lastName = ?, email = ?,address = ? WHERE id = ?', [firstName, lastName, email, address, id])
    return res.redirect('/');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})


let uploadFile = async (req, res) => {
    return res.render('uploadFile.ejs')
}

const upload = multer().single('profile_pic')

let handleUploadFile = async (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    upload(req, res, function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        // Display uploaded image for user validation
        res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="/upload">Upload another image</a>`);
    });
}

module.exports = { handleUploadFile, getHomePage, getDetailUser, createUser, deleteUser, editUser, updateUser, uploadFile } 