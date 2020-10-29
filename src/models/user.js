const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        max:64
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Number,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('User',userSchema)

