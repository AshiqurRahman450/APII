const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentId:{
        type:String,
        required:true,
    },
    studentName:{
        type:String,
        required:true,
    },
    dates:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    userId:{
        type: String,
        required: true, // This will hold the UID of the user
    },
});

const Attendance = mongoose.model("Attendance",attendanceSchema);

module.exports = Attendance;