const ProductEntity = require('../models/products.model');

async function findProduct(parameters) {
    const productName = parameters.product_name?.stringValue;
    if (!productName) {
        return "Xin lỗi, tôi không hiểu bạn đang tìm sản phẩm nào. Bạn có thể cung cấp tên sản phẩm không?";
    }

    const products = await ProductEntity.find({ name: { $regex: productName, $options: 'i' } });
    
    if (products.length > 0) {
        const productList = products.map(p => p.name).join(', ');
        return `Tôi đã tìm thấy ${products.length} sản phẩm phù hợp với yêu cầu của bạn, đó là: ${productList}. Bạn muốn biết thêm thông tin gì về các sản phẩm này?`;
    } else {
        return `Xin lỗi, tôi không tìm thấy sản phẩm nào phù hợp với "${productName}".`;
    }
}

async function getPrice(parameters) {
    const productName = parameters.product_name?.stringValue;
    if (!productName) {
        return "Xin lỗi, tôi không hiểu bạn đang hỏi giá của sản phẩm nào. Bạn có thể cung cấp tên sản phẩm không?";
    }

    const product = await ProductEntity.findOne({ name: { $regex: productName, $options: 'i' } });
    
    if (product) {
        return `Giá của sản phẩm "${product.name}" là ${product.price.toLocaleString('vi-VN')} VNĐ.`;
    } else {
        return `Xin lỗi, tôi không tìm thấy thông tin giá cho sản phẩm "${productName}".`;
    }
}

async function checkStock(parameters) {
    let productName = parameters.product_name?.stringValue;
    
    // Nếu product_name trống, thử lấy từ queryText
    if (!productName && parameters.queryText) {
        const queryText = parameters.queryText.stringValue;
        // Sử dụng regex để trích xuất tên sản phẩm
        const match = queryText.match(/kiểm tra (?:số lượng|tồn kho) (.+)/i);
        if (match) {
            productName = match[1];
        }
    }
    
    if (!productName) {
        return "Xin lỗi, tôi không hiểu bạn đang kiểm tra tồn kho của sản phẩm nào. Bạn có thể cung cấp tên sản phẩm không?";
    }

    const product = await ProductEntity.findOne({ name: { $regex: productName, $options: 'i' } });
    
    if (product) {
        return `Hiện tại chúng tôi còn ${product.quantity} sản phẩm "${product.name}" trong kho.`;
    } else {
        return `Xin lỗi, tôi không tìm thấy thông tin tồn kho cho sản phẩm "${productName}".`;
    }
}

module.exports = {
    findProduct, 
    getPrice, 
    checkStock
};