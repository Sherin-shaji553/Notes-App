const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const jwtMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            // console.log("Authorization header:", req.headers.authorization);

            const jwtResponse = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(jwtResponse.userId).select("-password");


            return next()
        } catch (err) {
            console.error('Token verification failed: ', err.message);
            return res.status(401).json({ message: 'Not authorized!!!' });
        }
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
}

module.exports = jwtMiddleware
