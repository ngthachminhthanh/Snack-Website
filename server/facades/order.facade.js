const orderService = require("../services/order.service");

module.exports = {
    async createOrder(email, address, province, district, ward, note, items, total_price) {
        return await orderService.createOrder(email, address, province, district, ward, note, items, total_price);
    },

    async getMyOrders(email) {
        return await orderService.getMyOrders(email);
    },

    async getAllOrders() {
        return await orderService.getAllOrders();
    },

    async updateOrderStatus(id, status) {
        return await orderService.updateOrderStatus(id, status);
    },
};
