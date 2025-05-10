const productService = require("../services/product.service");

module.exports = {
    async getAllProducts(search) {
        return await productService.getProducts(search);
    },

    async getProductsByCategory(category) {
        return await productService.getProductsByCategory(category);
    },

    async getPaginatedProducts(page, search) {
        return await productService.getPaginatedProducts(page, search);
    },

    async addProduct(productData) {
        return await productService.addProduct(productData);
    },

    async updateProduct(id, productData) {
        return await productService.updateProduct(id, productData);
    },

    async deleteProduct(id) {
        return await productService.deleteProduct(id);
    },
};
