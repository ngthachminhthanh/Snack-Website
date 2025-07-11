const mongoose = require("mongoose");
const CustomerEntity = require("../models/customers.model");
const { sendSuccessOrderMail } = require("../utils/mailer");

exports.createOrder = async (orderInput) => {
  try {
    const { email, address, province, district, ward, note, items, total_price } = orderInput;

    const newOrder = {
      orderId: new mongoose.Types.ObjectId().toString(),
      total_price,
      date_order: new Date(),
      address: `${address}, ${province}, ${district}, ${ward}`,
      products: items.map(item => ({
        name: item.product_name,
        price: item.product_price,
        quantity: item.quantity
      })),
      payment: {
        date_payment: new Date(),
        method: 'Cash on Delivery'
      },
      status: 'waiting for confirmation',
      note
    };

    const customer = await CustomerEntity.findOne({ email });
    if (!customer) throw new Error('Không tìm thấy khách hàng');

    customer.orders.push(newOrder);
    await customer.save();

    // Gửi gmail thông báo thông tin đơn hàng đã đặt
    await sendSuccessOrderMail(email, newOrder);

    return true;
  } catch (error) {
    console.error('Lỗi tạo đơn hàng:', error);
    throw new Error('Tạo đơn hàng thất bại');
  }
};

exports.getMyOrders = async (email) => {
    const customer = await CustomerEntity.findOne({ email });
    if (!customer) return null;

    const sortedOrders = customer.orders.sort((a, b) => new Date(b.date_order) - new Date(a.date_order));
    return sortedOrders;
};

exports.getAllOrders = async () => {
    const customers = await CustomerEntity.find();
    return customers.flatMap(customer =>
        customer.orders.map(order => ({
            _id: order.orderId,
            username: customer.username,
            address: order.address,
            phone: customer.phone,
            products: order.products,
            total_price: order.total_price,
            status: order.status || 'waiting for confirmation'
        }))
    );
};

exports.updateOrderStatus = async (id, status) => {
    return await CustomerEntity.findOneAndUpdate(
        { "orders.orderId": id },
        { $set: { "orders.$.status": status } },
        { new: true }
    );
};
