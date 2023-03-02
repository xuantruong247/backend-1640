const mongoose = require('mongoose')
const Schema = mongoose.Schema
 

const CategorySchema = new Schema({
    name : {
        type : String ,
        required : true ,
        unique : true
    },
    description : {
        type : String ,

    } ,
    createAt : {
        type : Date , 
        default : Date.now
    }
})
module.exports = mongoose.model('category' , CategorySchema)
