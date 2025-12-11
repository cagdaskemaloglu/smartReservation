const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes'); 
const resourceRoutes = require('./src/routes/resourceRoutes'); 
const reservationRoutes = require('./src/routes/reservationRoutes');
const frontendRoutes = require('./src/routes/frontendRoutes'); 
const { initializeNotificationService } = require('./src/utils/notificationService'); 

dotenv.config();
console.log('Is JWT Secret active: ', !!process.env.JWT_SECRET);

const app = express();

app.set('view engine', 'ejs'); 
app.set('views', './src/views');

connectDB(); 

app.use(express.json());

app.use(express.static('public'));

initializeNotificationService();

app.use('/api/auth', authRoutes); // api/auth/register
app.use('/api/resources', resourceRoutes);
app.use('/api/reservations', reservationRoutes);

app.use('/', frontendRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor...`));