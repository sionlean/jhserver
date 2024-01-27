// External Modules
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Utils
import { checkPassword, getJwtSecretKey } from "../utils";

// Constants
import { ROUTE_AUTHENTICATION } from "../../constants/constant";

const router = express.Router();

router.post(ROUTE_AUTHENTICATION.GET_TOKEN, (req: Request, res: Response) => {
  const password = req.body.password;
  if (checkPassword(password)) {
    const payload: Object = { message: "Access granted" };
    const options: jwt.SignOptions = { expiresIn: "7d" };
    const access_token = jwt.sign(payload, getJwtSecretKey(), options);
    const expiry = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

    res.status(200).send({ access_token, expiry });
  } else {
    const errorResponse = {
      error: {
        message: "Invalid password",
        code: "INVALID_PASSWORD",
        details: "The 'password' parameter is wrong. Please try again.",
      },
    };
    res.status(401).send(errorResponse);
  }
});

export default router;
