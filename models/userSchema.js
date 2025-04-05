const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    fullname : {type : String, required : true, trim : true},
    username : {type : String, required : true, trim : true, unique : true},
    email : {type : String, required : true, trim : true, lowercase : true},
    password : String,
    dp : {
           type : String,
           default : '',
        },
    pins : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'pin',
    }],

})

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema)