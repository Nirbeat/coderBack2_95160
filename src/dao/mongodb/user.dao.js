import { userModel } from "../../models/user.model.js";

class UserDAO {

    async findByEmail(email) {
        console.log("reconocimiento de email en dao", email);

        return await userModel.findOne({ email });
    }

    async create(user) {
        return await userModel.create(user);
    }
}

export default new UserDAO();