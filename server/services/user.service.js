const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../firebase');
const CustomerEntity = require('../models/customers.model');

const generateToken = (customer, isAdmin) => {
    const payload = {
        customer: {
            id: customer.id,
            isAdmin
        }
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
    async registerUser({ username, email, phone, password }) {
        let customer = await CustomerEntity.findOne({ email });
        if (customer) {
            throw new Error('Email đã được sử dụng, vui lòng thử email khác');
        }

        customer = new CustomerEntity({ username, email, phone, password });

        const salt = await bcrypt.genSalt(10);
        customer.password = await bcrypt.hash(password, salt);

        await customer.save();

        const token = generateToken(customer, false);

        return { token };
    },

    async loginUser({ email, password }) {
        const customer = await CustomerEntity.findOne({ email });
        if (!customer) {
            throw new Error('Thông tin Email chưa đúng hoặc không tồn tại');
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            throw new Error('Sai mật khẩu, vui lòng thử lại!');
        }

        const isAdmin = email === 'admin@gmail.com' && password === 'admin';
        const token = generateToken(customer, isAdmin);

        return {
            token,
            user: {
                username: customer.username,
                email: customer.email,
                phone: customer.phone,
                isAdmin
            }
        };
    },

    async loginWithFirebase(idToken) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const { uid, email, name, phone_number } = decodedToken;
        
            let user = await CustomerEntity.findOne({ email });
        
            if (!user) {
              user = new CustomerEntity({
                username: name || email.split('@')[0],
                email,
                phone: phone_number || "",
              });
              await user.save();
            }
        
            const adminEmails = ['admin@gmail.com'];
            const isAdmin = adminEmails.includes(email);

            const token = generateToken(user, isAdmin);
        
            return {
              token,
              user: {
                username: user.username,
                email: user.email,
                phone: user.phone,
                isAdmin,
              },
            };
          } catch (err) {
            throw new Error("Xác thực Firebase thất bại: " + err.message);
        }
    }
};
