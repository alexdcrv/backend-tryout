const {Schema, model, Types} = require ('mongoose')

const user = new Schema (
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        wins: {type: Number, required: false},
        loses: {type: Number, required: false}
    }
)
module.exports = model("User", user)