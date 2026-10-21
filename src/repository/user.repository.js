class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async findByEmail(email) {
        console.log("reconocimiento de email en dao", email);

        return this.dao.findByEmail(email);
    }

    async create(user) {
        return this.dao.create(user);
    }
}

export default UserRepository;
