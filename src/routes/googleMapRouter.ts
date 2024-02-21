// External Modules
import express, { Request, Response } from "express";

// LocalModules
import GoogleLocation from "../api/googleLocation";

// Constants
import { ROUTE_MAP } from "../constants/routes";

const router = express.Router();

router.post(ROUTE_MAP.GET_LOCATION, async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).send({ data: "Please input a query" });
  }

  const { code, reply } = await GoogleLocation.getInstance().getLocation(query);

  if (code === 200) {
    return res.status(code).send({ data: { location: reply } });
  } else {
    return res.status(code).send(reply);
  }
});

export default router;
