const jwt = require ('jsonwebtoken')
const config = require('config')
const tokenModel = require('../models/Tokens')
const jwt_secret_access = config.get('jwt_secret_access')
const jwt_secret_refresh = config.get('jwt_secret_refresh')
class TokenService  {
    generateToken (payload) {
        const accessToken = jwt.sign(payload, jwt_secret_access , {expiresIn:"30m"})
        const refreshToken = jwt.sign(payload, jwt_secret_refresh, {expiresIn:"90d"})
        return {
            accessToken, refreshToken
        }
        
    }

    async removeToken (refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData
    }



    async validateToken (token, secret) {
        try {
            const verify = jwt.verify(token, secret)
            return verify
        } catch (e) {
            return null
        }
    }

    async checkToken (refreshToken) {
        if(!refreshToken) {
            return false
        }
        const validate = this.validateToken(refreshToken, jwt_secret_access)
        const findToken = await tokenModel.findOne({refreshToken})
        if(!validate || !findToken) {
            return false
        } 
        return findToken
    }

    async saveToken (userId, refreshToken) {
        
        const tokenData = await tokenModel.findOne({user: userId})
        if(tokenData) {
            // const token = new tokenModel(tokenData)
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await tokenModel.create({user: userId, refreshToken})
        return token
    }
}
module.exports = new TokenService()