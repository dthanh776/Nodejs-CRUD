import express from 'express';
import apiController from "../controller/apiController";

let router = express.Router()

const initAPIRoute = (app) => {

    router.get("/users", apiController.getAllUsers)
    router.post("/create-users", apiController.createNewUser)
    router.put('/update-users', apiController.updateUser)
    router.delete('/delete-users/:userID', apiController.deleteUser)

    return app.use("/api/v1/", router);
}

module.exports = initAPIRoute;