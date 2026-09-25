const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Availability = sequelize.define('Availability', {
  dateKey: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('available', 'unavailable', 'requested', 'booked'),
    defaultValue: 'available',
  },
  note: {
    type: DataTypes.STRING,
  }
});

Availability.belongsTo(User, { as: 'RequestedBy', foreignKey: 'requestedBy' });
User.hasMany(Availability, { foreignKey: 'requestedBy' });

module.exports = Availability;
