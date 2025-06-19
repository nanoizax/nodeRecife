const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
  vehicleId: { type: Number, required: true, index: true },
  driverId: { type: Number, default: null, index: true },
  lat: { type: Number, required: true },              // ✅ Ahora lat
  lng: { type: Number, required: true },              // ✅ Ahora lng
  speed: { type: Number, required: true },
  engineStatus: { type: String, enum: ['on', 'off'], required: true },
  timestamp: { type: Date, default: () => new Date(), index: true }
});

module.exports = mongoose.model('Telemetry', telemetrySchema);