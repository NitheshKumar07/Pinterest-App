const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
    pinimage : {
        type : String,
        default : '',
     },
    pintitle : {type : String, trim : true},
    pindescription : {type : String, trim : true},
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
    },
    tags : [{
        type : String,
        trim : true,
        lowercase : true,
    }],
    link : String,

})


module.exports = mongoose.model('pin', pinSchema)