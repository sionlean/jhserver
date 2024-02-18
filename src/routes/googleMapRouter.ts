// External Modules
import express, { Request, Response } from "express";

// LocalModules
import GoogleLocation from "../api/googleLocation";
import MapErrorManager from "../lib/mapErrorManager";

// Constants
import { ROUTE_MAP } from "../constants/routes";

const router = express.Router();

router.get(ROUTE_MAP.GET_LOCATION, async (req: Request, res: Response) => {
  const { query } = req.body;
  const resp = await GoogleLocation.getInstance().getLocation(query);

  if (MapErrorManager.isCustomError(resp)) {
    return res.status(401).send(resp);
  } else {
    return res.status(200).send({ data: { places: resp } });
  }
});

export default router;
