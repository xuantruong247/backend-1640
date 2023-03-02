const mongoose = require('mongoose')
const Schema = mongoose.Schema
 
const ViewSchema = new Schema ({
    isVisited: {
        type: Boolean
    },
    userId : {
        type : mongoose.Types.ObjectId ,
        ref:'user'
    }
},
{ timestamps: true }
)

module.exports = mongoose.model('view' , ViewSchema)