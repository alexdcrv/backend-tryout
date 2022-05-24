const tokenService = require('../service/tokenService')
const config = require('config')
const jwt_secret_access = config.get('jwt_secret_access')
module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({message:'Auth Error1'})
        }
        const accessToken = authHeader.split(' ')[1]
        if (!accessToken) {
            return res.status(401).json({message:'Auth Error2'})
        }
        const validToken = tokenService.validateToken(accessToken, jwt_secret_access)
        if (!validToken) {
            console.log(validToken);
            return res.status(401).json({message:'Auth Error3'})
        }
        console.log(validToken);
        req.user = validToken
        next()
    } catch (e) {
        return res.status(401).json({message:'Auth Error4'})
    }
}   