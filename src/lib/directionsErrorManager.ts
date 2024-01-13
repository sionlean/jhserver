// Local Modules
import ErrorManagerBase from "./errorManagerBase";

// Interfaces
import { CustomError } from "../Interfaces/general";

export default class DirectionsErrorManager extends ErrorManagerBase {
  private constructor() {
    super();
  }
  static getErrorGettingGeocodeFromLocation = (err: unknown): CustomError => {
    return {
      error: {
        message: "Error getting geocode",
        code: "ERROR_GETTING_GEOCODE",
        details: JSON.stringify(err),
      },
    };
  };

  static getErrorGettingNearbyPlaces = (err: unknown): CustomError => {
    return {
      error: {
        message: "Error getting nearby places",
        code: "ERROR_GETTING_NEARBY_PLACES",
        details: JSON.stringify(err),
      },
    };
  };
}
