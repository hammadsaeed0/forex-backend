import mongoose from "mongoose";

const bookingSlotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  }
});

const BookingSlot = mongoose.model("BookingSlot", bookingSlotSchema);

export default BookingSlot;
