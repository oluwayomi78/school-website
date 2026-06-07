const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');

// load backend .env
// backend .env is sibling to the frontend folder, so go up two levels
dotenv.config({ path: path.join(__dirname, '..', '..', 'school-website backend', '.env') });

const uri = process.env.URI;
if (!uri) {
  console.error('No URI in env');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(uri, );
    console.log('Connected to MongoDB for seeding');

    const User = require(path.join(__dirname, '..', '..', 'school-website backend', 'model', 'userModel.js'));

    const adminEmail = 'admin@example.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashed = await bcrypt.hash('Admin@123', 10);
      admin = new User({ fullname: 'Seeder Admin', email: adminEmail, password: hashed, role: 'admin' });
      await admin.save();
      console.log('Created admin user', adminEmail);
    } else {
      console.log('Admin user exists');
    }

    // login to backend to get token
    const loginRes = await axios.post('http://localhost:3200/api/admin/login', { email: adminEmail, password: 'Admin@123' });
    const token = loginRes.data.token;
    console.log('Obtained token');

    const headers = { headers: { Authorization: `Bearer ${token}` } };

    // create attendance
    const att = await axios.post('http://localhost:3200/api/admin/attendance', { studentName: 'Test Student', course: 'software', status: 'present' }, headers);
    console.log('Attendance created:', att.data.attendance?._id || att.data._id || 'ok');

    // create admission
    const adm = await axios.post('http://localhost:3200/api/admin/admissions', { fullname: 'Applicant One', email: 'applicant@example.com', course: 'business' }, headers);
    console.log('Admission created:', adm.data.admission?._id || adm.data._id || 'ok');

    // create notification
    const not = await axios.post('http://localhost:3200/api/admin/notifications', { title: 'Test Notice', message: 'This is a test', channel: 'in-app' }, headers);
    console.log('Notification created:', not.data.notification?._id || not.data._id || 'ok');

    // fetch lists
    const [attendanceList, admissionsList, notificationsList] = await Promise.all([
      axios.get('http://localhost:3200/api/admin/attendance', headers),
      axios.get('http://localhost:3200/api/admin/admissions', headers),
      axios.get('http://localhost:3200/api/admin/notifications', headers)
    ]);

    console.log('Attendance count:', Array.isArray(attendanceList.data) ? attendanceList.data.length : 0);
    console.log('Admissions count:', Array.isArray(admissionsList.data) ? admissionsList.data.length : 0);
    console.log('Notifications count:', Array.isArray(notificationsList.data) ? notificationsList.data.length : 0);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err.response?.data || err.message || err);
    process.exit(1);
  }
})();
