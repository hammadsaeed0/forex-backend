import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Offer schema
const offerSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

// Define the User schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  amount: { type: Number, default: 0 },
  facebook: { type: Boolean, default: false },
  video: { type: Boolean, default: false },
  booking: { type: Boolean, default: false },
  offers: [offerSchema], // Embed offers as sub-documents
});

// Create models based on the schemas
const User = mongoose.model('User', userSchema);
const Offer = mongoose.model('Offer', offerSchema);

export { User, Offer };
