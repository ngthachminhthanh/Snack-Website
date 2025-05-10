const customerService = require("../services/customer.service");

module.exports = {
    async exportFile(dataType, format) {
        return await customerService.exportFile(dataType, format);
    },

    async getCustomers(page, search) {
        return await customerService.getCustomers(page, search);
    },
};