// External Modules
require("dotenv").config();
import cors from "cors";
import express from "express";


// Local Modules
import AppHelper from "./appHelper";
import AuthenticationRouter from "./routes/authenticationRouter";
import GoogleDirectionsRouter from "./routes/googleDirectionsRouter";
import OpenAIRouter from "./routes/openAIRouter";

// Utils
import { getWhitelistedOrigins } from "./utils";

// Constants
import { MAIN_ROUTES } from "./constant";

const app = express();

// Set middlewares
app.use(express.json()); // Parse request body
app.use(cors({ origin: getWhitelistedOrigins() })); // Set sites permission
app.use(AppHelper.verifyToken); // Verify user permission
app.use(AppHelper.rateLimiter()); // Rate limit to prevent abuse
app.use(AppHelper.rateLimiterError); // Throw customized error when rate limited

// Set all different main routes
app.use(MAIN_ROUTES.AUTHENTICATION, AuthenticationRouter);
app.use(MAIN_ROUTES.OPEN_AI, OpenAIRouter);
app.use(MAIN_ROUTES.DIRECTIONS, GoogleDirectionsRouter);

app.listen(process.env.PORT);
