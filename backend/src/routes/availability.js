const express = require('express');
const db = require('../db');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all availability records
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('availability').get();
    const records = snapshot.docs.map(doc => doc.data());
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// Admin toggles a date's availability
router.post('/toggle', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { dateKey } = req.body;

    const docRef = db.collection('availability').doc(dateKey);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().status === 'unavailable') {
      await docRef.set({ dateKey, status: 'available', requestedBy: null });
    } else {
      const status = doc.data().status;
      if (status === 'available') {
        await docRef.delete();
      } else if (status === 'requested') {
        await docRef.update({ status: 'booked' });
      } else if (status === 'booked') {
        await docRef.update({ status: 'available', requestedBy: null });
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

// User requests to book a date
router.post('/request', authenticate, async (req, res) => {
  try {
    const { dateKey } = req.body;
    const userId = req.user.uid;

    const docRef = db.collection('availability').doc(dateKey);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().status !== 'available') {
      return res.status(400).json({ error: 'Date is not available for booking' });
    }

    await docRef.update({ status: 'requested', requestedBy: userId });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to request booking' });
  }
});

module.exports = router;
