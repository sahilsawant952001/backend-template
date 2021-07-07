const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    console.log(req.body);
    try {
        const token = req.body.authToken;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            message: 'unauthorized user'
        });
    }
};