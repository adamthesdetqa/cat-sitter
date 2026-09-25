const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const availabilityRoutes = require('./routes/availability');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/availability', availabilityRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => console.error('Unable to connect to the database:', err));
