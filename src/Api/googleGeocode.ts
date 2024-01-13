// External Modules
import {
  GeocodeRequest,
  GeocodeResult,
} from "@googlemaps/google-maps-services-js";

// Local Modules
import GoogleBase from "./googleBase";
import DirectionsErrorManager from "../lib/directionsErrorManager";

// Interfaces
import { CustomError } from "../Interfaces/general";

export default class GoogleGeocode extends GoogleBase {
  constructor() {
    super();
  }

  private geocode = this.client.geocode;
  private country = "SG";

  getGeocodeInfoFromLocation = async (
    address: string
  ): Promise<CustomError | GeocodeResult> => {
    const geocodeParams: GeocodeRequest = {
      params: {
        address,
        components: { country: this.country }, // To be changed in the future
        ...this.getAPIKeyParams(),
      },
    };

    try {
      const { data, statusText } = await this.geocode(geocodeParams);
      const results = data?.results;

      if (statusText !== "OK") {
        throw new Error(statusText);
      } else if (data?.error_message) {
        throw new Error(data?.error_message);
      } else if (!results?.length) {
        throw new Error("No results found");
      } else {
        return results[0]; // We only care about the first result
      }
    } catch (err) {
      return DirectionsErrorManager.getErrorGettingGeocodeFromLocation(err);
    }
  };
}