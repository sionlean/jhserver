// External Modules
require("dotenv").config();
import cors from "cors";
import express from "express";

// Local Modules
import AIRouter from "./routes/aiRouter";
import AppHelper from "./appHelper";
import AuthenticationRouter from "./routes/authenticationRouter";
import GoogleMapRouter from "./routes/googleMapRouter";
import GoogleLocation from "./api/googleLocation";

// Utils
import { getWhitelistedOrigins } from "./utils";

// Constants
import { MAIN_ROUTES } from "./constants/routes";

const app = express();

// Set middlewares
app.use(express.json()); // Parse request body
app.use(cors({ origin: getWhitelistedOrigins() })); // Set sites permission
app.use(AppHelper.verifyToken); // Verify user permission
app.use(AppHelper.rateLimiter()); // Rate limit to prevent abuse
app.use(AppHelper.rateLimiterError); // Throw customized error when rate limited

// Set all different main routes
app.use(MAIN_ROUTES.AUTHENTICATION, AuthenticationRouter);
app.use(MAIN_ROUTES.AI, AIRouter);
app.use(MAIN_ROUTES.MAPS, GoogleMapRouter);

app.listen(process.env.PORT, async () => {
  console.log("Server started...");
  // const resp = await GoogleLocation.getInstance().getLocation(
  //   "highly rated chicken rice"
  // );
  // console.log(resp);
});
