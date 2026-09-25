const express = require('express');
const cors = require('cors');
const functions = require('firebase-functions');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const availabilityRoutes = require('./routes/availability');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/availability', availabilityRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  // Only start the server if this file is run directly (local development)
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
