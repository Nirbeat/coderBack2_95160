import { userModel } from "../models/user.model.js";

export async function getAll(req, res, next) {
    try {
        const users = await userModel.find({});
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
    }
}

export async function getByEmail(req, res, next) {
    try {

    } catch (error) {
        console.log(error);
    }
}

export async function update(req, res, next) {
    try {

    } catch (error) {
        console.log(error);
    }
}