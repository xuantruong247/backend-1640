const mongoose = require('mongoose');
const submissionSchema  = mongoose.Schema({
    name: {
        type: String,
        required : true,
        unique : true
    },
    description: {
        type: String
    },
    closureDate: {
        type: Date
        
    },
    finalClosureDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})
 
module.exports = mongoose.model('submission', submissionSchema);