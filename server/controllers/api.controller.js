const productFacade = require("../facades/product.facade");
const orderFacade = require("../facades/order.facade");
const customerFacade = require("../facades/customer.facade");

// PRODUCTS
exports.getAllProducts = async (req, res) => {
    try {
        const products = await productFacade.getAllProducts(req.query.search);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await productFacade.getProductsByCategory(req.params.category);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPaginatedProducts = async (req, res) => {
    try {
        const { page, search } = req.query;
        const result = await productFacade.getPaginatedProducts(Number(page), search);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const product = await productFacade.addProduct(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updated = await productFacade.updateProduct(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await productFacade.deleteProduct(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ORDERS
exports.createOrder = async (req, res) => {
    try {
        await orderFacade.createOrder(req.body);
        res.status(201).json({ message: "Order placed successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await orderFacade.getMyOrders(req.params.email);
        if (!orders) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await orderFacade.getAllOrders();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        await orderFacade.updateOrderStatus(req.params.id, req.body.status);
        res.status(200).json({ message: "Status updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CUSTOMERS
exports.getCustomers = async (req, res) => {
    try {
        const { page, search } = req.query;
        const result = await customerFacade.getCustomers(Number(page), search);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.exportFile = async (req, res) => {
    try {
        const { dataType } = req.params;
        const { format } = req.query;
        const result = await customerFacade.exportFile(dataType, format);

        if (result.format === "json") {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(result.data);
        } else if (result.format === "csv") {
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", `attachment; filename=${dataType}.csv`);
            res.status(200).send(result.data);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
