const productFacade = require("../facades/product.facade");
const orderFacade = require("../facades/order.facade");
const customerFacade = require("../facades/customer.facade");

const { findProduct, getPrice, checkStock } = require("../utils/chatbot_handler"); 
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Đọc file provinces-api JSON một lần khi khởi động server
const provincesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../provinces-api.json'), 'utf-8')
);

// PROVINCES
exports.getAllProvinces = (req, res) => {
    try {
      const provinces = provincesData.map(({ name, code }) => ({ name, code }));
      res.json(provinces);
    } catch (err) {
      res.status(500).json({ error: "Không thể lấy danh sách tỉnh/thành" });
    }
};

exports.getProvinceByCode = (req, res) => {
    const { provinceCode } = req.params;
  
    try {
      const province = provincesData.find(p => p.code == provinceCode);
  
      if (!province) {
        return res.status(404).json({ error: "Không tìm thấy tỉnh/thành" });
      }
  
      res.json(province);
    } catch (err) {
      res.status(500).json({ error: "Lỗi khi lấy thông tin tỉnh/thành" });
    }
};
  

exports.getDistrictByCode = (req, res) => {
    const { districtCode } = req.params;
  
    try {
      let foundDistrict = null;
  
      for (const province of provincesData) {
        const district = province.districts.find(d => d.code == districtCode);
        if (district) {
          foundDistrict = district;
          break;
        }
      }
  
      if (!foundDistrict) {
        return res.status(404).json({ error: "Không tìm thấy quận/huyện" });
      }
  
      res.json(foundDistrict);
    } catch (err) {
      res.status(500).json({ error: "Lỗi khi lấy thông tin quận/huyện" });
    }
};  

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

// ----- 
// API handler for Dialogflow 
const projectId = process.env.GOOGLE_PROJECT_ID;
const languageCode = 'vi'; 


// Create a new session client
const sessionClient = new dialogflow.SessionsClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

async function handleIntent(result) {
    const action = result.action;
    const parameters = result.parameters.fields;

    if (!parameters || Object.keys(parameters).length === 0) {
        return "Xin lỗi, tôi không hiểu yêu cầu của bạn. Bạn có thể cung cấp thêm thông tin không?";
    }

    switch(action) {
        case 'findProduct':
            return await findProduct(parameters);
        case 'getPrice':
            return await getPrice(parameters);
        case 'checkStock':
            return await checkStock(parameters);
        default:
            return result.fulfillmentText || "Xin lỗi, tôi không hiểu yêu cầu của bạn. Bạn có thể cung cấp thêm thông tin không?";
    }
}

exports.textQuery = async (req, res) => {
    try {
        // Tạo một sessionId mới cho mỗi request
        const sessionId = uuid.v4();
        const sessionPath = sessionClient.projectAgentSessionPath(
            projectId,
            sessionId
        );
        
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: req.body.text,
                    languageCode: languageCode,
                },
            },
        };

        const responses = await sessionClient.detectIntent(request);
        console.log('All responses from Dialogflow: ', responses);

        const result = responses[0].queryResult;
        console.log('Result: ', result);
        console.log(`Query text: ${result.queryText}`);
        console.log(`Response: ${result.fulfillmentText}`);
        console.log(`Extracted parameters:`, result.parameters.fields);
        console.log(`Triggered Action: ${result.action}`);        

        // Xử lý intent và tương tác với MongoDB
        let responseText = await handleIntent(result);
        res.json({...result, fulfillmentText: responseText});
    } catch (error) {
        console.error('Lỗi trong text query:', error);
        res.status(500).json({ error: 'Có lỗi gì đó đã xảy ra với text query' });
    }
}

exports.eventQuery = async (req, res) => {
    try {
        // Tạo một sessionId mới cho mỗi request
        const sessionId = uuid.v4();
        const sessionPath = sessionClient.projectAgentSessionPath(
            projectId,
            sessionId
        );
        
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: req.body.event,
                    languageCode: languageCode,
                },
            },
        };

        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        console.log(`Query: ${result.queryText}`);
        console.log(`Response: ${result.fulfillmentText}`);

        // Xử lý intent và tương tác với MongoDB
        let responseText = await handleIntent(result);
        res.json({...result, fulfillmentText: responseText});
    } catch (error) {
        console.error('Lỗi trong event query:', error);
        res.status(500).json({ error: 'Có lỗi gì đó đã xảy ra với event query' });
    }
}