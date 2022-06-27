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
    let isError = false
    const {email, password, fullname, league} = req.body
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            isError = true
            return res.status(400).json({message: 'Validation Error',errors: errors.array()})
        }
        
        const notUniq = await User.findOne({email})

        if (notUniq) {
            isError = true
           return res.status(400).json({message: 'This email already registered'})
        } 

        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email: email, password: hashPassword, fullname: fullname, league: league})
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true} )
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return res.status(200).json({...tokens, user})        
        
    } catch (e) {
        res.status (500).json({message: 'Server error'})
        console.log('%cauth.js line:10 e', 'color: #007acc;', e);
        isError = true
    } finally {
        if(!isError) {
            const admin = await User.findOne({isAdmin: true})
            const user = await User.findOne({email: req.body.email})
            const update = async ()=>{
                for (let i = 0; i < admin.currentSeason; i++) {
                  user.seasons.push({
                    season: i+1,
                    league: league, 
                    wins: 0, 
                    loses: 0, 
                    setsW: 0, 
                    setsL: 0, 
                    gamesW: 0, 
                    gamesL: 0,
                    points: 0,
                    history:[]
                })  
                }
                if (admin) await user.save()
            }
            update()
        }
    }
   
})

router.post('/login', async (req,res)=>{
    try{
        console.log(req.body);
        const {email, password} = req.body
        const user = await User.findOne({email: email})
        if (!user) {
            return res.status(400).json({message: 'User not found'})
        }
        console.log(password, user);
        const isRightPassword = await bcrypt.compare(password, user.password)
        if (!isRightPassword) {
            return res.status(400).json({message: 'Wrong password'})
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false} )
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return res.status(200).json({...tokens, user: user})
        } catch (e) {
            console.log('%cauth.js line:84 e', 'color: #007acc;', e);
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
        return res.status(200).json({...tokens, user: user})
    } catch (e) {
        console.log(e);
        res.status (500).json({message: 'Server error', e})
    }
})
