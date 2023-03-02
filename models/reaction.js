const mongoose = require('mongoose')
const Schema = mongoose.Schema
 
const ReactionSchema = new Schema ({
    reactionType :{
        type: Number,
        require: true
    },
    userId : {
        type : mongoose.Types.ObjectId ,
        ref:'user'
    }
},
{ timestamps: true }
)

module.exports = mongoose.model('reaction' , ReactionSchema)