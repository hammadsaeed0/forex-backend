import express from "express";
import { connectDB } from "./config/database.js";
const app = express();
// import { APP_PORT } from "./config/index.js";
import router from "./routes/userRoutes.js";
import ErrorMiddleware from "./middleware/Error.js";
import bodyParser from "body-parser";
import cors from "cors";
import fileupload from "express-fileupload";

connectDB();
// Use Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  fileupload({
    useTempFiles: true,
  })
);
// Import User Routes
app.use("/v1", router);

app.get("/cancel", (req, res) => {
  res.send("Something Went Wrong, Payment Not Done!!");
});

app.get("/", (req, res) => {
  res.send("Welcome Forex");
});

app.listen(8000, () => {
  console.log(`Server is Running on ${8000}`);
});
app.use(ErrorMiddleware);
