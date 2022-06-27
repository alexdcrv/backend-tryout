const {Schema, model, Types} = require ('mongoose')
const Game = require ('./Game')
const user = new Schema (
    {
        isAdmin: {type: Boolean, required: false},
        currentSeason: {type: Number, required: false},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        fullname: {type: String, required: true},
        league: {type: String, required: false},
        mainhand: {type: String, required: false},
        backhand: {type: String, required: false},
        seasons: [
            { 
                league: String, 
                season: {type:Number, required:false}, 
                wins: {type:Number, required:false}, 
                loses: {type:Number, required:false}, 
                setsW: {type:Number, required:false}, 
                setsL: {type:Number, required:false}, 
                gamesW: {type:Number, required:false}, 
                gamesL: {type:Number, required:false},
                points: {type:Number, required:false},
                history: [{
                    winner: { type: String, required: true },
                    loser: { type: String, required: true },
                    firstSet: {
                      type: {
                        firstResult: String,
                        secondResult: String,
                      },
                      required: true,
                    },
                    secondSet: {
                      type: {
                        firstResult: String,
                        secondResult: String,
                      },
                      required: true,
                    },
                    thirdSet: {
                      type: {
                        firstResult: String,
                        secondResult: String,
                      },
                      required: false,
                    },
                    season: {type: Number, required: false},
                    league: {type: String, required: false}
                  }]
            }
        ]
    }
)
module.exports = model("User", user)