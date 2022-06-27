const {Router} = require ('express')
const Users = require ('../models/User')
const Games = require ('../models/Game')
const router = Router()
const authMiddleware = require ('../middlewares/authMiddleware')
module.exports = router

router.post('/create', async (req,res)=>{
    try {
        const winner = await Users.findOne({_id: req.body.winner})
        const loser = await Users.findOne({_id: req.body.loser})
       
        await Games.create({...req.body, season: req.body.season})
        console.log(req.body);
        const winSeason = ()=>{
            return winner.seasons[req.body.season-1]
        }
        
        winSeason().history.push(req.body)
        winSeason().points = winSeason().points + 1
        winSeason().wins = winSeason().wins + 1
        winSeason().setsW = winSeason().setsW + 2
        winSeason().gamesW = winSeason().gamesW + parseInt(req.body.firstSet.firstResult) + parseInt(req.body.secondSet.firstResult) + parseInt(req.body.thirdSet?req.body.thirdSet.firstResult:'0')
        winSeason().gamesL = winSeason().gamesL + parseInt(req.body.firstSet.secondResult) + parseInt(req.body.secondSet.secondResult) + parseInt(req.body.thirdSet?req.body.thirdSet.secondResult:'0')
        if(req.body.thirdSet) {
            winSeason().setsL = winSeason().setsL + 1
        } 
        await winner.save();
        const loserSeason = ()=>{
            return loser.seasons[req.body.season-1]
        }
        loserSeason().history.push(req.body)
        loserSeason().loses = loserSeason().loses + 1
        loserSeason().points = loserSeason().points + 0.25
        loserSeason().setsL = loserSeason().setsL + 2
        loserSeason().gamesW = loserSeason().gamesW + parseInt(req.body.firstSet.secondResult) + parseInt(req.body.secondSet.secondResult) + parseInt(req.body.thirdSet?req.body.thirdSet.secondResult:'0')
        loserSeason().gamesL = loserSeason().gamesL + parseInt(req.body.firstSet.firstResult) + parseInt(req.body.secondSet.firstResult) + parseInt(req.body.thirdSet?req.body.thirdSet.firstResult:'0')
        if(req.body.thirdSet) {
            loserSeason().setsW = loserSeason().setsW + 1
        }
        await loser.save();
       
        res.status(200).json({message: "OK"})
    } catch (e) {
        console.log(e);
        res.status(500).json({message:'Server Error'})
    }
})
