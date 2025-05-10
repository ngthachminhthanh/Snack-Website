const ProductEntity = require("../models/products.model");

exports.getProducts = async (search) => {
    let query = {};
    if (search) {
        query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ]
        };
    }
    return await ProductEntity.find(query);
};

exports.getProductsByCategory = async (category) => {
    return await ProductEntity.find({ category });
};

exports.getPaginatedProducts = async (page, search) => {
    const limit = 6;
    const skip = (page - 1) * limit;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};

    const totalProducts = await ProductEntity.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await ProductEntity.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 });

    return { products, currentPage: page, totalPages };
};

exports.addProduct = async (productData) => {
    const newProduct = new ProductEntity(productData);
    return await newProduct.save();
};

exports.updateProduct = async (id, productData) => {
    return await ProductEntity.findByIdAndUpdate(id, productData, { new: true });
};

exports.deleteProduct = async (id) => {
    return await ProductEntity.findByIdAndDelete(id);
};
