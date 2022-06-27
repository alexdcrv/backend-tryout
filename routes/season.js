const {Router} = require ('express')
const Users = require ('../models/User')
const router = Router()
const authMiddleware = require ('../middlewares/authMiddleware')

module.exports = router

router.get('/current', async (req,res)=>{
    try {
        const admin = await Users.findOne({isAdmin: true})
        // await users.save();
        res.status(200).json({currentSeason: admin.currentSeason})
    } catch (e) {
        console.log(e);
        res.status(500).json({message:'Server Error'})
    }
})
router.get('/startSeason', async (req,res)=>{
    try {

        const admin = await Users.findOne({isAdmin: true})
        const users = await Users.find()
        console.log(users);

        const update = async () => {
            console.log( admin.currentSeason);
            admin.currentSeason = admin.currentSeason + 1
            await admin.save()
            return admin.currentSeason
        }
        update().then((s)=>{
            users.map(async(user)=> {
                const season = {
                    season: s,
                    league: user.league ? user.league : '', 
                    wins: 0, 
                    loses: 0, 
                    setsW: 0, 
                    setsL: 0, 
                    gamesW: 0, 
                    gamesL: 0,
                    points: 0,
                    history:[]
                } 
                user.seasons.push(season)
                await user.save();
            })
        })
        // await users.save();
        res.status(200).json({message:'OK'})
    } catch (e) {
        console.log(e);
        res.status(500).json({message:'Server Error'})
    }
})