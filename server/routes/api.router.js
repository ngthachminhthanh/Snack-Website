const express = require("express");
const router = express.Router();
const apiController = require('../controllers/api.controller');
const prefixProducts = '/products';
const prefixAdmin = '/admin';
const prefixDialogflow = '/dialogflow';

// Endpoint API router for User
router.get(prefixProducts, apiController.getAllProducts);
router.get(`${prefixProducts}/:category`, apiController.getProductsByCategory);
router.post('/order', apiController.createOrder);
router.get('/myorders/:email', apiController.getMyOrders);
router.get('/provinces', apiController.getAllProvinces);
router.get('/provinces/:provinceCode', apiController.getProvinceByCode);
router.get('/districts/:districtCode', apiController.getDistrictByCode);

// Endpoint API router for Admin
router.get(`${prefixAdmin}/export/:dataType`, apiController.exportFile);
router.get(`${prefixAdmin}/orders`, apiController.getAllOrders);
router.patch(`${prefixAdmin}/orders/:id`, apiController.updateOrderStatus);
router.get(`${prefixAdmin}/products`, apiController.getPaginatedProducts);
router.post(`${prefixAdmin}/products`, apiController.addProduct);
router.put(`${prefixAdmin}/products/:id`, apiController.updateProduct);
router.delete(`${prefixAdmin}/products/:id`, apiController.deleteProduct);
router.get(`${prefixAdmin}/customers`, apiController.getCustomers);

// Endpoint API router for Dialogflow
router.post(`${prefixDialogflow}/textQuery`, apiController.textQuery);
router.post(`${prefixDialogflow}/eventQuery`, apiController.eventQuery);

module.exports = router;