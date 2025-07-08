const ProductEntity = require('../models/products.model');

async function findProduct(parameters) {
    const productName = parameters.product_name?.stringValue;
    if (!productName) {
        return "Xin lỗi, tôi không biết bạn đang tìm món ăn nào. Bạn có thể cung cấp thêm thông tin về món ăn không?";
    }

    const products = await ProductEntity.find({ name: { $regex: productName, $options: 'i' } });
    
    if (products.length > 0) {
        const productList = products.map(p => p.name).join(', ');
        return `Tôi đã tìm thấy ${products.length} món ăn phù hợp với yêu cầu của bạn, đó là: ${productList}. Bạn muốn biết thêm thông tin gì về các món ăn này?`;
    } else {
        return `Xin lỗi, tôi không tìm thấy món ăn nào phù hợp mà bạn cần tìm. Hoặc có thể website chúng tôi hiện chưa có món đó, mong bạn thông cảm.`;
    }
}

async function getPrice(parameters) {
    const productName = parameters.product_name?.stringValue;
    if (!productName) {
        return "Xin lỗi, tôi không hiểu bạn đang hỏi giá của món ăn nào. Bạn có thể cung cấp tên món ăn chính xác hơn không?";
    }

    const product = await ProductEntity.findOne({ name: { $regex: productName, $options: 'i' } });
    
    if (product) {
        return `Giá của món "${product.name}" là ${product.price.toLocaleString('vi-VN')} VNĐ/${product.unit}.`;
    } else {
        return `Xin lỗi, tôi không tìm thấy thông tin giá cho món "${productName}".`;
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
        return "Xin lỗi, tôi không hiểu bạn đang kiểm tra số lượng còn lại của món ăn nào. Bạn có thể cung cấp tên món ăn không?";
    }

    const product = await ProductEntity.findOne({ name: { $regex: productName, $options: 'i' } });
    
    if (product) {
        return `Hiện tại chúng tôi còn ${product.quantity} món "${product.name}" trong cửa hàng.`;
    } else {
        return `Xin lỗi, tôi không tìm thấy thông tin về số lượng còn lại cho món "${productName}".`;
    }
}

module.exports = {
    findProduct, 
    getPrice, 
    checkStock
};