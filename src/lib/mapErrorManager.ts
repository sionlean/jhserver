// Local Modules
import ErrorManagerBase from "./errorManagerBase";

// Interfaces
import { CustomError } from "../Interfaces/general";

export default class mapErrorManager extends ErrorManagerBase {
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

  static getErrorGettingPlaces = (err: unknown): CustomError => {
    return {
      error: {
        message: "Error getting places",
        code: "ERROR_GETTING_PLACES",
        details: JSON.stringify(err),
      },
    };
  };
}
