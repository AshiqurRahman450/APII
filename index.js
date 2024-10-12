const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const router = require('express').Router()
const app = express();
const port = 8000;
const cors = require("cors");
const moment = require('moment');
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connectDb = async () => {
  try {
    await mongoose.connect('mongodb+srv://Spidifa:Ashik0786%40@cluster0.wzbbx.mongodb.net/attendance');
    console.log('db connected SuccessFully');


  } catch (error) {
    console.log(error.message)
  }
}

connectDb()

app.listen(port, () => {
  console.log("Server is running on port 8000")
})

const Student = require("./models/student");
const Attendance = require("./models/Attendance");

app.get('/', (req, res) => {
  res.send({ msg: 'route is working' })
})
//endpoint to register a Student
// Express Route for fetching students by user ID
app.get('/students', async (req, res) => {
  const { userId } = req.query; // Use query parameters
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' }); // Input validation
  }

  try {
    const students = await Student.find({ userId: userId }); // Assuming you're using MongoDB
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for this user' }); // No data handling
    }
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});


// Express Route for adding a student
app.post('/addStudent', async (req, res) => {
  const { studentName, studentId, studentClass, dateOfBirth, phoneNumber, email, userId } = req.body;
  try {
      const newStudent = new Student({
          studentName,
          studentId,
          studentClass,
          dateOfBirth,
          phoneNumber,
          email,
          userId, // Store the user ID for reference
      });
      await newStudent.save();
      res.status(201).json(newStudent);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding student' });
  }
});


//endpoint to fetch all the employees
// app.get("/students", async (req, res) => {
//   try {
//     const students = await Student.find();
//     res.status(200).json(students)

//   } catch (error) {
//     res.status(500).json({ message: "Failed to add an Employee" })

//   }
// });

app.post("/Attendance", async (req, res) => {
  try {
    const { studentId, studentName, dates, status, userId } = req.body;  // Include userId from request body

    const existingAttendance = await Attendance.findOne({ studentId, dates, userId });  // Find by userId as well

    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();
      res.status(200).json(existingAttendance);
    } else {
      const newAttendance = new Attendance({
        studentId,
        studentName,
        dates,
        status,
        userId,  // Save the userId with attendance
      });
      await newAttendance.save();
      res.status(200).json(newAttendance);
    }
  } catch (error) {
    res.status(500).json({ message: "Error Submitting Attendance" });
  }
});


app.get("/Attendance", async (req, res) => {
  try {
    const { date } = req.query;

    const attendanceData = await Attendance.find({ dates: date })

    res.status(200).json(attendanceData)

  } catch (error) {
    res.status(500).json({ message: "Error fetching Attendance" })

  }
});


app.get("/attendance-report-all-employees", async (req, res) => {
  const userId = req.query.userId; // Get userId from query params
  try {
    // Fetch attendance records filtered by userId (if needed)
    const attendanceRecords = await Attendance.find({ userId });

    // Create a report based on the attendance records
    let reportMap = {};

    attendanceRecords.forEach((record) => {
      const studentId = record.studentId;

      if (!reportMap[studentId]) {
        reportMap[studentId] = {
          Present: 0,
          Absent: 0,
          Halfday: 0,
          Leave: 0,
        };
      }

      // Count occurrences of different statuses
      if (record.status === "Present") reportMap[studentId].Present += 1;
      if (record.status === "Absent") reportMap[studentId].Absent += 1;
      if (record.status === "Halfday") reportMap[studentId].Halfday += 1;
      if (record.status === "Leave") reportMap[studentId].Leave += 1;
    });

    // Fetch corresponding student details from Student collection
    const studentIds = Object.keys(reportMap);
    const students = await Student.find({ studentId: { $in: studentIds } });

    // Merge the student details with the attendance report
    const report = students.map((student) => ({
      studentId: student.studentId,
      studentName: student.studentName,
      studentClass: student.studentClass,
      Present: reportMap[student.studentId]?.Present || 0,
      Absent: reportMap[student.studentId]?.Absent || 0,
      Halfday: reportMap[student.studentId]?.Halfday || 0,
      Leave: reportMap[student.studentId]?.Leave || 0,
    }));

    // Return the report
    res.status(200).json({ report });
  } catch (error) {
    console.error("Error generating attendance report:", error);
    res.status(500).json({ message: "Error generating the report" });
  }
});





// DELETE route to remove a student by studentId
app.delete('/studentss/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    console.log(studentId);
    
    // Find the student by studentId and remove them
    const student = await Student.findByIdAndDelete(studentId);
 console.log(student);
 
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error('Error removing student:', error);
    return res.status(500).json({ message: 'Error removing student' });
  }
});




