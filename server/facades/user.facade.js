const userService = require('../services/user.service');

module.exports = {
    async registerUser(data) {
        return await userService.registerUser(data);
    },

    async loginUser(data) {
        return await userService.loginUser(data);
    }
};
