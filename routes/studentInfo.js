const express = require('express')
const data = require('../database/student-info.json')
const studentInfo = express.Router()
const deviceDetector = require('device-detector'); 

const fs = require('fs')

studentInfo.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    req.clientIP = ip;
    
    // const deviceInfo = req.header('user-agent')
    // req.deviceType = deviceInfo;

    const userAgent = req.get('User-Agent');
    const deviceInfo = deviceDetector.parse(userAgent);
    req.deviceType = deviceInfo.os || 'Runtime environment';

    next();
});

studentInfo.get('/student-info', (req, res) => {
    res.json({
        data: data,
        deviceType: req.deviceType,
        clientIP: req.clientIP
    });
});

studentInfo.post('/student-info/:student_id', (req, res) => {
    const { student_id } = req.params;

    const foundStudent = data.find(s => s.student_id === student_id)
    if (foundStudent) {
        res.json({
            student: foundStudent,
            deviceType: req.deviceType,
            clientIP: req.clientIP
        });
    } else {
        res.status(404).json({
            message: 'Student not found! Please check the student, make sure it\'s all in uppercase. Students are case sensitive.',
            deviceType: req.deviceType,
            clientIP: req.clientIP
        });
    }
});

studentInfo.post('/course-student-info/cs548', (req, res) => {
    const cs548Students = data
        .filter(s => s.courses.some(course => course.course_id === 'CS548'))
        .map(student => ({ student_id: student.student_id })); 
    
        if (cs548Students.length > 0) {
        res.json({
            cs548Students: cs548Students,
            deviceType: req.deviceType,
            clientIP: req.clientIP
        });
    } else {
        res.status(404).json({
            message: 'There are no students who have taken CS548',
            deviceType: req.deviceType,
            clientIP: req.clientIP
        });
    }
});

studentInfo.post('/course-student-info/other-courses', (req, res) => {
    const otherClassStudents = data
        .filter(student => student.courses.some(course => course.course_id === 'CS548'))
        .map(student => ({ student_id: student.student_id }));

    if (otherClassStudents.length > 0) {
        res.json({
            otherClassStudents: otherClassStudents,
            deviceType: req.deviceType,
            clientIP: req.clientIP
        });
    } else {
        res.status(404).json({
            message: 'There are no students who have taken courses other than CS548',
            deviceType: req.deviceType,
            clientIP: req.clientIP
        });
    }
});

exports.studentInfo = studentInfo
