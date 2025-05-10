const userFacade = require('../facades/user.facade');

exports.register = async (req, res) => {
    try {
        const result = await userFacade.registerUser(req.body);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ msg: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const result = await userFacade.loginUser(req.body);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ msg: err.message });
    }
};
