const pool = require('../database')

// User Registration API
const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substr(2, 5);
    return timestamp + randomString;
};

const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    const uniqueId = generateUniqueId();
    try {
        const query = 'INSERT INTO users (userid, username, email, password) VALUES ($1, $2, $3, $4) RETURNING userid';
        const result = await pool.query(query, [uniqueId, username, email, password]);
        if (result.rows.length > 0) {
            res.status(201).send({ message: 'New user created', AddedID: result.rows[0].userid });
        } else {
            res.status(500).send({ message: 'Failed to create new user' });
        }
    } catch (err) {
        console.error('Error creating new user:', err);
        res.status(500).send({ message: 'Failed to create new user' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
        const result = await pool.query(query, [email, password]);
        if (result.rows.length > 0) {
            res.status(200).send({ message: 'Login successful',AddedID: result.rows[0].userid });
        } else {
            res.status(401).send({ message: 'Invalid login credentials' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('An error occurred during login');
    }
};

// Timestamp Generation Function
const generateTimestamp = () => {
    // Create a new Date object
    const currentDate = new Date();

    // Get individual components of the date and time
    const year = currentDate.getFullYear(); // Get the current year
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day = String(currentDate.getDate()).padStart(2, '0'); // Get the day of the month
    const hours = String(currentDate.getHours()).padStart(2, '0'); // Get the hours (0-23)
    const minutes = String(currentDate.getMinutes()).padStart(2, '0'); // Get the minutes (0-59)
    const seconds = String(currentDate.getSeconds()).padStart(2, '0'); // Get the seconds (0-59)

    // Get the timezone offset in hours
    const timeZoneOffset = currentDate.getTimezoneOffset();
    const timeZoneOffsetHours = Math.abs(Math.floor(timeZoneOffset / 60)).toString().padStart(2, '0');
    const timeZoneSign = timeZoneOffset >= 0 ? '-' : '+';

    // Combine date and time components
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    const timeZone = `${timeZoneSign}${timeZoneOffsetHours}`;

    // Concatenate date, time, and timezone
    const dateTimeWithTimeZone = `${formattedDate} ${formattedTime}${timeZone}`;

    // Output the current date and time with timezone
    return dateTimeWithTimeZone;
};

module.exports = {
    signUp,
    login,
    generateTimestamp
};