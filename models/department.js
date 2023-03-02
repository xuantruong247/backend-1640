const mongoose = require('mongoose') ;
const Schema = mongoose.Schema

const departmentSchema = new Schema({
    name:{
        type: String ,
        require : true,
        unique: true
    },
    description: {
        type: String
    },
    createAt : {
        type : Date ,
        default : Date.now
    }
})
module.exports = mongoose.model('department',departmentSchema) 