import express from "express";
import {
  sendEmail,
  verifyOTP,
  Login,
  buyFacebookOffer,
  allFbJoinRequest,
  approvedOrRejectRequest,
  applyForLacture,
  myApplicationForLacture,
  getAllLactureApplicaiton,
  bookLiveSession,
  getAllMyBooking,
  getAllBooking,
  addBookingTime,
  getAllTime,
  deleteTime,
  getAllTimeOfDate,
  updateTimeStatus,
  checkout,
  checkVideo,
  checkFacebookLink,
  GetMyProfile,

} from "../controller/userController.js";

const router = express.Router();

router.route("/login").post(Login);
router.route("/myProfile").post(GetMyProfile);
router.route("/sendEmail").post(sendEmail);
router.route("/verify").post(verifyOTP);
router.route("/joinFacebook/:id").post(buyFacebookOffer);
router.route("/applyForLacture").post(applyForLacture);
router.route("/myApplications/:userId").post(myApplicationForLacture);
router.route("/getAllMyBooking").post(getAllMyBooking);
router.route("/getAllLactureApplicaiton").post(getAllLactureApplicaiton);
router.route("/allFbJoinRequest").post(allFbJoinRequest);
router.route("/bookLiveSession").post(bookLiveSession);
router.route("/getAllBooking").post(getAllBooking);
router.route("/addBookingTime").post(addBookingTime);
router.route("/getAllTime").post(getAllTime);
router.route("/updateStatusForDate").post(updateTimeStatus);
router.route("/getAllTimeOfDate").post(getAllTimeOfDate);
router.route("/checkout").post(checkout);
router.route("/checkVideo").post(checkVideo);
router.route("/checkFacebookLink").post(checkFacebookLink);
router.route("/deleteTime/:id").post(deleteTime);
router.route("/approvedOrRejectRequest/:id").post(approvedOrRejectRequest);



export default router;
