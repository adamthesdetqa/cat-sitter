const express = require('express');
const Availability = require('../models/Availability');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all availability records
router.get('/', async (req, res) => {
  try {
    const records = await Availability.findAll();
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

    const existing = await Availability.findOne({ where: { dateKey } });

    if (!existing || existing.status === 'unavailable') {
      await Availability.upsert({ dateKey, status: 'available' });
    } else if (existing.status === 'available') {
      await Availability.destroy({ where: { dateKey } });
    } else if (existing.status === 'requested') {
      await Availability.update({ status: 'booked' }, { where: { dateKey } });
    } else if (existing.status === 'booked') {
      await Availability.update({ status: 'available', requestedBy: null }, { where: { dateKey } });
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

    const existing = await Availability.findOne({ where: { dateKey } });

    if (!existing || existing.status !== 'available') {
      return res.status(400).json({ error: 'Date is not available for booking' });
    }

    await Availability.update({ status: 'requested', requestedBy: userId }, { where: { dateKey } });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to request booking' });
  }
});

module.exports = router;
