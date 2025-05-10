const ProductEntity = require("../models/products.model");
const CustomerEntity = require("../models/customers.model");
const { Parser } = require('json2csv');

exports.getCustomers = async (page, search) => {
    const limit = 5;
    const query = {
        $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ]
    };

    const [totalCustomers, customers] = await Promise.all([
        CustomerEntity.countDocuments(query),
        CustomerEntity.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
    ]);

    const totalPages = Math.ceil(totalCustomers / limit);

    const formattedCustomers = customers.map(customer => ({
        _id: customer._id,
        username: customer.username,
        email: customer.email,
        orders: customer.orders.map(order => ({
            ...order.toObject(),
            total_price: order.total_price,
            date_order: order.date_order.toISOString(),
            payment: {
                ...order.payment,
                date_payment: order.payment.date_payment.toISOString()
            }
        }))
    }));

    return {
        customers: formattedCustomers,
        currentPage: page,
        totalPages,
    };
};

exports.exportFile = async (dataType, format) => {
    let data;
    let fields;

    if (dataType === 'customers') {
        data = await CustomerEntity.find({}, '-password');
        fields = ['username', 'email', 'phone'];
    } else if (dataType === 'products') {
        data = await ProductEntity.find({});
        fields = ['name', 'description', 'price', 'quantity', 'category', 'unit'];
    } else {
        throw new Error("Invalid dataType");
    }

    if (format === 'json') {
        return { format: 'json', data };
    } else if (format === 'csv') {
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(data);
        return { format: 'csv', data: csv };
    } else {
        throw new Error("Invalid format");
    }
};