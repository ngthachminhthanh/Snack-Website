const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const userFacade = require('../facades/user.facade');

router.post('/register', authController.register);
router.post('/loginWithEmailandPassword', authController.loginWithEmailandPassword);

router.post('/login/google', async (req, res) => {
    try {
      const { idToken } = req.body;
      const result = await userFacade.loginWithFirebase(idToken);
      res.json(result);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
});

router.post('/login/facebook', async (req, res) => {
    try {
      const { idToken } = req.body;
      const result = await userFacade.loginWithFirebase(idToken);
      res.json(result);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
});

router.post("/send-reset-otp", authController.sendResetOtp);
router.post("/reset-password", authController.resetPassword);

module.exports = router;