const {Router} = require ('express')
const Users = require ('../models/User')
const router = Router()
const authMiddleware = require ('../middlewares/authMiddleware')

module.exports = router
router.get('/getUsers/all', async (req, res)=>{
    try {   
        const users = await Users.find({
            'isAdmin': {$ne: true}
        })
        res.status(200).json({users})
    } catch (e) {
        console.log(e);
        res.status(500).json({message:'Server Error'})
    }
})
router.get('/getUsers', async (req, res)=>{
    try {   
        const admin = await Users.findOne({ isAdmin: true })
        const users = await Users.find().
         where("seasons.league").equals(req.query.league).
         where('seasons.season').equals(admin.currentSeason)
        res.status(200).json({users})
    } catch (e) {
        console.log(e);
        res.status(500).json({message:'Server Error'})
    }
})
router.get('/getUserById', async (req, res)=>{
    try {   
        const user = await Users.findOne({
            _id: req.query.id
        })
        res.status(200).json({user: user})
    } catch (e) {
        res.status(500).json({message:'Server Error'})
    }
})
router.put('/edit', async (req,res)=>{
    try {   
        const user = await Users.findOne({
            _id: req.query.id
          })
          const upd = async() =>{
            console.log(user.seasons[user.seasons.length-1], 'league');
            user.league = req.query.league
            user.seasons[user.seasons.length-1].league = req.query.league
          }
          if (req.query.league) upd();
          const keys = Object.keys(req.body);
          for (const key of keys) {
              user[key] = req.body[key];
          }
          await user.save();
          res.status(200).json({user})

    } catch (e) {
        res.status(500).json({message:'Server Error'})
    }
})
router.delete('/deleteUser', async (req,res)=>{
    try{
        await Users.deleteOne({
            _id: req.query.id
        })
        res.status(200).json({message:'Deleted'})
    } catch (e) {
        res.status(500).json({message:'Server Error'})
    } 
   
})
// router.put('/editLeague', async (req,res)=>{
//     try {   
//         const user = await Users.findOne({
//             _id: req.query.id
//           })
//           const upd = async() =>{
//             console.log(user.seasons[user.seasons.length-1], 'league');
//             user.seasons[user.seasons.length-1].league = req.body.league
//             await user.save()
//           }
//           upd()
//           await user.save();
//         res.status(200).json({user})
//     } catch (e) {
//         res.status(500).json({message:'Server Error'})
//         console.log(e);
//     }
// })
