const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
    pinimage : String,
    pintitle : {type : String, trim : true},
    pindescription : {type : String, trim : true},
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
    },
    tags : [{
        type : stringify,
        trim : true,
    }]

})


module.exports = mongoose.model('pin', pinSchema)