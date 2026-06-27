// backend/server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middlewares
app.use(cors()); 
app.use(express.json()); 

// 2. MySQL Connection Configuration (Updated for Cloud SSL Compatibility)
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'college_system',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false // Uses SSL on the cloud, disables it on your local laptop machine
});

// 3. Test Database Connection & Automatically Create and Sync Tables
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to MySQL Database:', err.message);
    console.log('👉 Tip: Ensure your native MySQL service is running on your computer.');
  } else {
    console.log('✅ Successfully connected to MySQL Database!');
    
    // 0. Create Users Table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL
      );
    `;

    // Repair script to ensure role isn't limited by old constraints
    const alterRoleColumn = `ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL;`;

    // 1. Create Marks Table
    const createMarksTable = `
      CREATE TABLE IF NOT EXISTS marks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        subject VARCHAR(100) NOT NULL,
        obtained_marks INT NOT NULL,
        max_marks INT NOT NULL
      );
    `;

    // 2. Create Attendance Table
    const createAttendanceTable = `
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        percentage INT NOT NULL,
        gpa DECIMAL(3,2) NOT NULL
      );
    `;

    // 3. Create Assignments Table
    const createAssignmentsTable = `
      CREATE TABLE IF NOT EXISTS assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        due_date VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL
      );
    `;
    
    // Execute all table creations sequentially
    connection.query(createUsersTable, () => {
      connection.query(alterRoleColumn, () => {
        connection.query(createMarksTable, () => {
          connection.query(createAttendanceTable, () => {
            connection.query(createAssignmentsTable, () => {
              console.log('📊 All MySQL database tables (including users) synchronized.');
              
              // Seed marks table if empty
              connection.query("SELECT COUNT(*) AS count FROM marks", (err, rows) => {
                if (!err && rows[0].count === 0) {
                  const seedMarks = `
                    INSERT INTO marks (user_id, subject, obtained_marks, max_marks) VALUES
                    (1, 'Computer Architecture', 42, 50),
                    (1, 'Compiler Design', 39, 50),
                    (1, 'Reinforcement Learning', 45, 50),
                    (1, 'Java Programming', 48, 50);
                  `;
                  connection.query(seedMarks);
                }
              });

              // Seed attendance table if empty
              connection.query("SELECT COUNT(*) AS count FROM attendance", (err, rows) => {
                if (!err && rows[0].count === 0) {
                  const seedAttendance = `INSERT INTO attendance (user_id, percentage, gpa) VALUES (1, 82, 8.45);`;
                  connection.query(seedAttendance);
                }
              });

              // Seed assignments table if empty
              connection.query("SELECT COUNT(*) AS count FROM assignments", (err, rows) => {
                if (!err && rows[0].count === 0) {
                  const seedAssignments = `
                    INSERT INTO assignments (user_id, title, due_date, status) VALUES
                    (1, 'Compiler Syntax Directed Translation Sheet', '2026-06-25', 'Pending'),
                    (1, 'Markov Decision Processes Problem Set', '2026-06-12', 'Submitted');
                  `;
                  connection.query(seedAssignments);
                }
              });

              connection.release();
            });
          });
        });
      });
    });
  }
});

// 4. API Endpoint: User Registration (Fixed & Robust Casing Handling)
app.post('/api/auth/register', async (req, res) => {
  let { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Please enter all required fields." });
  }

  // Safely capitalize first letter to ensure matching with legacy table lookups (e.g. 'Student')
  role = role.trim();
  role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sqlQuery = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    
    db.query(sqlQuery, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        console.error('❌ MySQL Registration Query Failed:', err);
        if (err.code === 'ER_DUP_ENTRY' || err.sqlState === '23000') {
          return res.status(400).json({ message: "This institutional email is already registered!" });
        }
        return res.status(500).json({ message: `Database constraint failure: ${err.message}` });
      }
      
      return res.status(201).json({ 
        message: "User account provisioned successfully!", 
        userId: result.insertId 
      });
    });

  } catch (error) {
    console.error('❌ Server Try-Catch Failed:', error);
    return res.status(500).json({ message: "Internal server authentication configuration routine fault." });
  }
});

// 5. API Endpoint: User Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const sqlQuery = "SELECT * FROM users WHERE email = ?";
  
  db.query(sqlQuery, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!results || results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    try {
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'fallbackSecretKey',
        { expiresIn: '1d' }
      );

      return res.json({
        message: "Login successful!",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (tokenError) {
      return res.status(500).json({ message: "Error generating authentication token" });
    }
  });
});

// 6. Base Route
app.get('/', (req, res) => {
  res.send('College Management System Backend API is active...');
});

// 5.5 DYNAMIC API Endpoint: Get Complete Student Academic Data from DB
app.get('/api/student/academics', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID parameter is required" });
  }

  const marksQuery = "SELECT subject, obtained_marks AS obtainedMarks, max_marks AS maxMarks FROM marks WHERE user_id = ?";
  const attendanceQuery = "SELECT percentage, gpa FROM attendance WHERE user_id = ? LIMIT 1";
  const assignmentsQuery = "SELECT id, title, due_date AS dueDate, status FROM assignments WHERE user_id = ?";

  db.query(marksQuery, [userId], (err, marksResults) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(attendanceQuery, [userId], (err, attendanceResults) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(assignmentsQuery, [userId], (err, assignmentsResults) => {
        if (err) return res.status(500).json({ error: err.message });

        const attendanceRecord = attendanceResults[0] || { percentage: 0, gpa: 0.00 };

        const academicData = {
          attendance: attendanceRecord.percentage,
          gpa: parseFloat(attendanceRecord.gpa),
          internals: marksResults,
          assignments: assignmentsResults
        };

        res.json(academicData);
      });
    });
  });
});

// 8. NEW FACULTY API Endpoints: Manage Marks Data
app.get('/api/faculty/students', (req, res) => {
  db.query("SELECT id, name, email FROM users WHERE role = 'Student'", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/faculty/marks', (req, res) => {
  const { userId, subject, obtainedMarks, maxMarks } = req.body;

  if (!userId || !subject || obtainedMarks === undefined || !maxMarks) {
    return res.status(400).json({ message: "Missing required assessment parameters." });
  }

  const checkQuery = "SELECT id FROM marks WHERE user_id = ? AND subject = ?";
  db.query(checkQuery, [userId, subject], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      const updateQuery = "UPDATE marks SET obtained_marks = ?, max_marks = ? WHERE user_id = ? AND subject = ?";
      db.query(updateQuery, [obtainedMarks, maxMarks, userId, subject], (updateErr) => {
        if (updateErr) return res.status(500).json({ error: updateErr.message });
        res.json({ message: "Marks updated successfully!" });
      });
    } else {
      const insertQuery = "INSERT INTO marks (user_id, subject, obtained_marks, max_marks) VALUES (?, ?, ?, ?)";
      db.query(insertQuery, [userId, subject, obtainedMarks, maxMarks], (insertErr) => {
        if (insertErr) return res.status(500).json({ error: insertErr.message });
        res.json({ message: "Marks recorded successfully!" });
      });
    }
  });
});

// 7. Start Server Listener
app.listen(PORT, () => {
  console.log(`🚀 Server is running smoothly on port ${PORT}`);
});