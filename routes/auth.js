const {Router} = require ('express')
const bcrypt = require ('bcryptjs')

const tokenService = require ('../service/tokenService')
const UserDto = require ('../dtos/userDto')
const User = require ('../models/User')
const router = Router()
const {body, validationResult} = require ("express-validator")
// interface IReg {
//     email: string
//     password: string
// }
module.exports = router

router.post('/register', body('email').isEmail(), body('password').isLength({min: 3}), async (req,res)=>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({message: 'Validation Error',errors: errors.array()})
        }
        const {email, password} = req.body
        const notUniq = await User.findOne({email})
        if (notUniq) {
           return res.status(400).json({message: 'This email already registered'})
        } 
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email: email, password: hashPassword})
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true} )
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return res.status(200).json({...tokens, user: userDto})        
        
    } catch (e) {
        res.status (500).json({message: 'Server error'})
        console.log('%cauth.js line:10 e', 'color: #007acc;', e);
    }

   
})

router.post('/login', async (req,res)=>{
    try{
    const {email, password} = req.body
    const user = await User.findOne({email})
    if (!user) {
       return res.status(400).json({message: 'User not found'})
    }
    const isRightPassword = await bcrypt.compare(password, user.password)
    if (!isRightPassword) {
        return res.status(400).json({message: 'Wrong password'})
     }
     const userDto = new UserDto(user)
     const tokens = tokenService.generateToken({...userDto})
     res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true} )
     await tokenService.saveToken(userDto.id, tokens.refreshToken)
     return res.status(200).json({...tokens, user: userDto})
    } catch (e) {
        res.status (500).json({message: 'Server error'})
    }
})

router.post('/logout', async (req,res)=>{
    try {
        const {refreshToken} = req.cookies
        await tokenService.removeToken(refreshToken)

        res.clearCookie('refreshToken')
        return res.status(200).json({token: refreshToken})
    } catch (e) {
        res.status (500).json({message: 'Server error'})
    }
})

router.get('/refresh', async (req,res)=>{
    try {
        const {refreshToken} = req.cookies
        const newToken = await tokenService.checkToken(refreshToken)
        if(!newToken) {
            return res.status(401).json({message: 'Unauthorozed'})
        }
        // console.log('%cauth.js line:82 newToken', 'color: #007acc;', newToken);
        const user = await User.findById(newToken.user)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true} )
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return res.status(200).json({...tokens, user: userDto})
    } catch (e) {
        res.status (500).json({message: 'Server error', e})
    }
})
