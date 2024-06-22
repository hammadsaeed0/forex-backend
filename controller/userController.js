import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../model/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import Request from "../model/Request.js";
import LectureApplication from "../model/Lanture.js";
import Booking from "../model/Booking.js";
import BookingSlot from "../model/BookingSlot.js";
import Stripe from "stripe";
const stripe = new Stripe("sk_test_26PHem9AhJZvU623DfE1x4sd");

cloudinary.v2.config({
  cloud_name: "dirfoibin",
  api_key: "315619779683284",
  api_secret: "_N7-dED0mIjUUa3y5d5vv2qJ3Ww",
});

// Login Buyer
export const Login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if the email exists in the database
    let user = await User.findOne({ email });

    if (!user) {
      // If email not found, register the user
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({ email, password: hashedPassword });

      // Return the user object
      return res.status(200).json({ success: true, user });
    }

    // If email found, check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Incorrect password" });
    }

    // Password is correct, return the user object
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

// Login Buyer
export const GetMyProfile = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  try {
    // Check if the email exists in the database
    let user = await User.findOne({ email });
    if (user) {

      return res.status(200).json({ success: true, user });
    }

    return res.status(200).json({ success: false, message: "User Nor Found" });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

// Send OTP Email
export const sendEmail = async (req, res, next) => {
  const { email } = req.body;

  // Check if user with the same email already exists
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return next(new ErrorHandler("User not found", 409));
  }
  try {
    const verificationCode = Math.floor(10000 + Math.random() * 90000)
      .toString()
      .substring(0, 5);
    existingUser.otp = verificationCode;
    await existingUser.save();

    var transporter = await nodemailer.createTransport({
      host: "mail.mtecsoft.com",
      port: "465",
      // tls: {
      //     rejectUnauthorized:false
      // },
      auth: {
        user: "audtiklance@mtecsoft.com",
        pass: "audtik@098",
      },
    });

    const mailData = {
      from: '"T-Right" <audtiklance@mtecsoft.com>',
      to: email,
      subject: "One Time OTP",
      text: "Forget Password",
      html: ` <!DOCTYPE html>
      <html>
      <head>
          <title>Password Reset</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
              }

              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
              }

              h2 {
                  color: #0056b3;
              }

              p {
                  color: #777777;
              }

              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 4px;
              }

              .otp {
                  font-size: 24px;
                  color: #333333;
                  margin: 20px 0;
              }

              .footer {
                  margin-top: 20px;
                  text-align: center;
                  color: #999999;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Password Reset</h2>
              <p>Hello,</p>
              <p>We received a request to reset your password. Your One-Time Password (OTP) is:</p>
              <div class="otp">${verificationCode}</div>
              <p>Please use this OTP to reset your password. If you did not request this reset, please ignore this email.</p>
              <p>Best regards,</p>
              <p>The T-Right Developer Team</p>
          </div>
          <div class="footer">
              <p>This email was sent to you as part of our security measures.</p>
              <p>&copy; 2023 T-Right. All rights reserved.</p>
          </div>
      </body>
      </html>
    `,
    };

    const info = await transporter.sendMail(mailData);

    res.status(200).json({
      success: true,
      message: "Mail sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

// Verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User Not Found", 404));
    }

    if (user.otp !== otp) {
      return next(new ErrorHandler("Invalid OTP", 400));
    }

    user.otp = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP Confirmed",
    });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

// // // Add User Images
// export const UploadImage = async (req, res, next) => {
//   let images = [];
//   if (req.files && req.files.avatars) {
//     if (!Array.isArray(req.files.avatars)) {
//       images.push(req.files.avatars);
//     } else {
//       images = req.files.avatars;
//     }
//   }
//   // console.log("Image1", images);
//   console.log("Image2", req);
//   // console.log("Image3", req.avatars);
//   let responce = [];
//   for (const image of images) {
//     try {
//       const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
//       // console.log(result);
//       const publidId = result.public_id;
//       const url = result.url;
//       let data = {
//         publidId,
//         url,
//       };
//       //  console.log(data);
//       responce.push(data);
//     } catch (error) {
//       console.log(error);
//       return res
//         .status(500)
//         .json({ error: "Error uploading file", success: false });
//     }
//   }
//   // console.log("-->1",responce);
//   //     res.json{responce , result}
//   // res.send(responce);
//   res.json({ success: true, data: responce });
// };

// Join Facebook Group
export const buyFacebookOffer = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const { id } = req.params;
    let user = id;
    const request = new Request({ email, name, user });
    await request.save();
    res.json({
      success: true,
      message: "Request to join group sent successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get All Joining Request
export const allFbJoinRequest = async (req, res, next) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Approve & Reject Request
export const approvedOrRejectRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    request.status = 'approved';
    await request.save();

    const user = await User.findOne({ email: request.email });
    user.facebook = true;
    await user.save();
    res.json({ success: true, message: "Request approved successfully" });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ success: false, message: "Internal server error", err });
  }
};

// Apply For Lacture
export const applyForLacture = async (req, res, next) => {
  try {
    const { email, lectureId } = req.body;

    // Check if the email exists in the database
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found in the database" });
    }

    // Check if lectureId is provided
    if (!lectureId) {
      return res
        .status(400)
        .json({ success: false, message: "Lecture ID is required" });
    }

    // Update the status of the video for the user and add lectureId
    existingUser.video = true; // Assuming this updates the video status
    if (!existingUser.lectures) {
      existingUser.lectures = [];
    }
    existingUser.lectures.push(lectureId);

    await existingUser.save();

    // Respond with the updated user object
    res.status(200).json({ success: true, user: existingUser });
  } catch (error) {
    // Respond with error message if an error occurs
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Apply For Lacture
export const myApplicationForLacture = async (req, res, next) => {
  try {
    // Extract user ID from request parameters
    const { userId } = req.params;

    // Find all applications associated with the user ID
    const applications = await LectureApplication.find({ userId });

    // Respond with the applications
    res.json({ success: true, applications });
  } catch (error) {
    // Respond with error message if an error occurs
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Apply For Lacture
export const getAllLactureApplicaiton = async (req, res, next) => {
  try {
    // Find all applications
    const applications = await LectureApplication.find();

    // Respond with the applications
    res.json({ success: true, applications });
  } catch (error) {
    // Respond with error message if an error occurs
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Book Live Session
export const bookLiveSession = async (req, res, next) => {
  try {
    const { sessionDate, email, name, sessionTime } = req.body;
    const user = await User.findOne({ email });

    // If user not found, return error
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    const userId = user?._id?.toString();
    // Create a new booking
    const booking = new Booking({
      userId,
      email,
      name,
      sessionDate,
      sessionTime,
    });
    // Save the booking to the database
    user.booking = true; 
    await user.save();
    await booking.save();
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GetAllMyBooking
export const getAllMyBooking = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Retrieve all bookings for the specified user from the database
    const bookings = await Booking.find({ email });
    res.json({ success: true, bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GetAllBooking
export const getAllBooking = async (req, res, next) => {
  try {
    // Retrieve all bookings from the database
    const bookings = await Booking.find();
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Add Booking Time
export const addBookingTime = async (req, res, next) => {
  try {
    // Extract data from the request body
    const { date, time, status } = req.body;

    // Create a new booking document
    const newBooking = new BookingSlot({
      date,
      time,
      status,
    });

    // Save the new booking to the database
    await newBooking.save();

    // Respond with success message
    res.status(201).json({ message: "Available time added successfully" });
  } catch (error) {
    // Handle any errors
    console.error("Error adding available time:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// Get All Time
export const getAllTime = async (req, res, next) => {
  try {
    // Extract only the relevant data (date, time, status) from each booking
    const availableTimes = await BookingSlot.find();

    // Respond with the array of available times
    res.status(200).json(availableTimes);
  } catch (error) {
    // Handle any errors
    console.error("Error fetching available times:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// Get All Time
export const deleteTime = async (req, res, next) => {
  try {
    const booking = await BookingSlot.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await BookingSlot.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Time
export const getAllTimeOfDate = async (req, res, next) => {
  try {
    // Extract the date from the request body
    const { date } = req.body;

    // Find all bookings for the specified date
    const bookings = await BookingSlot.find({ date });

    // Filter out the times with status true
    const times = bookings
      .filter((booking) => booking.status === true)
      .map((booking) => booking.time);

    // Return the times in the response
    res.status(200).json({ times });
  } catch (error) {
    console.error("Error fetching times for date:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Status Of time
export const updateTimeStatus = async (req, res) => {
  try {
    // Extract the ID and new status from the request body
    const { id, newStatus } = req.body;

    // Find the booking with the specified ID and update its status
    const updatedBooking = await BookingSlot.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true } // Return the updated document
    );

    // Check if a booking was found and updated
    if (updatedBooking) {
      res
        .status(200)
        .json({ message: `Status updated for booking with ID: ${id}` });
    } else {
      res.status(404).json({ message: `Booking not found with ID: ${id}` });
    }
  } catch (error) {
    console.error("Error updating time status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Update Status Of time
export const checkout = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: { name: item.name },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: "http://localhost:3001/dashboard",
      cancel_url: "https://forex-cancel.vercel.app/",
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Update Status Of time
export const checkVideo = async (req, res) => {
  const { email } = req.body; // Destructure email from req.body
  try {
    // Find the user by email in the database
    const user = await User.findOne({ email: email });

    if (!user) {
      // User not found in the database
      return res.status(404).json({ status: false });
    }

    // Check the video status of the user
    const videoStatus = user.video || false;

    // Return the video status
    res.json({ status: videoStatus });
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({ status: false });
  }
};

// Update Status Of time
export const checkFacebookLink = async (req, res) => {
  const { email } = req.body;
  try {
    // Find the user by email in the database
    const user = await User.findOne({ email: email });

    if (!user) {
      // User not found in the database
      return res.status(404).json({ message: "User not found" });
    }

    // // Return the result
    res.json({ status: user.facebook });
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({ staus: "Internal server error" });
  }
};

