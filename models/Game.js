const { Schema, model, Types } = require("mongoose");

const game = new Schema({
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
});
module.exports = model("Game", game);
