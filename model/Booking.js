// models/Booking.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  sessionDate: {
    type: String,
    required: true,
  },
  sessionTime: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = model('Booking', bookingSchema);

export default Booking;
