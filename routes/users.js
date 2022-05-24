const {Router} = require ('express')
const Users = require ('../models/User')
const router = Router()
const authMiddleware = require ('../middlewares/authMiddleware')
module.exports = router

router.get('/getUsers', authMiddleware, async (req,res)=>{
    try {   
        const users = await Users.find()
        res.status(200).json({users})
    } catch (e) {
        res.status(500).json({message:'Server Error'})
    }
})