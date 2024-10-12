const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId:{
        type:String,
        required:true,
        unique:true,
    },
    studentName:{
        type:String,
        required:true,
    },
    studentClass:{
        type:String,
        required:true,
    },
    dateOfBirth:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    userId: {
        type: String,
        required: true, // This will hold the UID of the user
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Student = mongoose.model("Student",studentSchema);
module.exports= Student